#include <iostream>
#include "json.hpp"
#include "Init.h"
#include "Fitness.h"
#include "Crossing.h"
#include "Mutation.h"
#include "SortPopulations.hpp"
#include "SelectRanging.h"
#include "GetRndDouble.h"
#include "GetRndInteger.h"
#include "MinFitnessValue.hpp"
#include "MeanFitnessValue.h"
#include "BS_thread_pool.hpp"
#include "InitIndivid.hpp"
#include "TypeDefs.h"
#include <fstream>
#include <vector>
#include <cstring>
#include <cstdlib>
#include <mutex>
using namespace std;
using namespace nlohmann;
using namespace BS;

int main()
{
    try
    {
        json data = json();

        ifstream fileData("data.json");
        data = json::parse(fileData);
        cout << "Test!!" << endl;
        cout << "Test!!" << endl;

        const int max_day = data["max_day"];
        const int max_pair = data["max_pair"];

        const json evolution_values = data["evolution_values"];
        const int population_size = evolution_values["population_size"];
        const int max_generations = evolution_values["max_generations"];
        const double p_crossover = evolution_values["p_crossover"];
        const double p_mutation = evolution_values["p_mutation"];
        const double p_genes = evolution_values["p_genes"];
        const double p_elitism = evolution_values["p_elitism"];

        const json general_values = data["general_values"];
        const double penaltySameRecSc = general_values["penaltySameRecSc"];
        const double penaltyGrWin = general_values["penaltyGrWin"];
        const double penaltyTeachWin = general_values["penaltyTeachWin"];
        const double penaltyLateSc = general_values["penaltyLateSc"];
        const double penaltyEqSc = general_values["penaltyEqSc"];
        const double penaltySameTimesSc = general_values["penaltySameTimesSc"];
        const int num_elit = population_size * p_elitism;

        vector <clas> classes = vector <clas>();
        for (json cl : data["classes"]) {
            classes.push_back(clas(cl, population_size));
        }

        vector<audience> audiences = vector<audience>();
        for (json aud : data["audiences"]) {
            audience new_aud(aud);
            audiences.push_back(new_aud);
        }

        base_schedule bs = base_schedule(data["base_schedule"]["schedule_group"],data["base_schedule"]["schedule_teacher"], data["base_schedule"]["schedule_audience"]);

        thread_pool worker_pool;
        timer Timer;
        Timer.start();
        timer TimerRes;
        cout << "Init starts" << endl;
        // В каждом классе хранится массив занятий для индивида, на который ссылаются индивиды, то есть изменение расписания влечет изменение данных у всех
        auto populations = Init(classes, max_day, max_pair,population_size, audiences, bs);
        cout << "Init ends" << endl;
        Timer.stop();
        cout << "The elapsed time was " << Timer.ms() << " ms.\n";
        int countIter = 0;
        individ bestPopulation = individ();
        map<string, double> temp;
        vector<pair<int, int>> result = vector<pair<int, int>>();
        result.push_back(make_pair(0,0));
        while (countIter < max_generations && bestPopulation.fitnessValue.fitnessValue != 0)
        {
            TimerRes.start();
            Timer.start();
            cout << "Crossing starts" << endl;

            for (int i = 0; i < population_size; i++)
            {
                if (GetRndDouble() < p_crossover)
                {
                    int r1 = GetRndInteger(0, population_size - 1);
                    int r2 = GetRndInteger(0, population_size - 1);
                    while (r1 == r2)
                    {
                        r1 = GetRndInteger(0, population_size - 1);
                        r2 = GetRndInteger(0, population_size - 1);
                    }
                    auto ind1 = &populations[r1];
                    auto ind2 = &populations[r2];
                    worker_pool.push_task([&ind1, &ind2, &classes, &r1, &r2](){
                        Crossing(ind1, ind2, classes, r1, r2);
                    });
                }
            }
            worker_pool.wait_for_tasks();
            cout << "Crossing ends" << endl;
            Timer.stop();
            cout << "The elapsed time was " << Timer.ms() << " ms.\n";


            Timer.start();
            cout << "Mutation starts" << endl;
            for (int i = 0; i < population_size; i++)
            {
                if (GetRndDouble() < p_mutation)
                {
                    auto mutant = &populations[i];
                    worker_pool.push_task([&mutant, &p_genes, &max_day, &max_pair, &audiences, &classes, &i](){
                        Mutation(mutant, i,p_genes, max_day, max_pair, audiences, classes);
                    });
                }
            }
            worker_pool.wait_for_tasks();
            cout << "Mutation ends" << endl;
            Timer.stop();
            cout << "The elapsed time was " << Timer.ms() << " ms.\n";


            Timer.start();
            cout << "Fitness starts" << endl;
            for (int i = 0; i < population_size; i++)
            {
                auto ind = &populations[i];
                worker_pool.push_task([&ind, &max_day, &penaltySameRecSc, &penaltyGrWin, &penaltySameTimesSc, &penaltyTeachWin, &i, &classes](){
                    Fitness(ind, max_day, classes, i, penaltySameRecSc, penaltyGrWin, penaltySameTimesSc, penaltyTeachWin);
                });
            }
            worker_pool.wait_for_tasks();
            cout << "Fitness ends" << endl;
            Timer.stop();
            cout << "The elapsed time was " << Timer.ms() << " ms.\n";


            Timer.start();
            cout << "Selection starts" << endl;

            auto temp_schedules = vector<vector<vector<schedule>>>();
            for (auto cl : classes){
                temp_schedules.push_back(cl.schedules);
            }

            SortPopulations(populations);
            vector<individ> new_population;
            for (int i = 0; i < num_elit; i++)
            {
                auto ind = individ();
                InitIndivid(ind,classes,i, new_population.size(), temp_schedules);
                new_population.push_back(ind);
            }

            // Выборка ранжированием
            auto p_populations = vector<double>(population_size);
            double p_cur = 0;
            for (int i = 0; i < population_size; i++) {
              double a = GetRndDouble() + 1;
              double b = 2 - a;
              p_populations[i] = p_cur;
              p_cur = p_cur + (1 / population_size) * (a - (a - b) * (i / (population_size - 1)));
            }
            p_populations.push_back(1.001);
            auto individ_indexes = vector<int>();
            for (int i = 0; i < population_size - num_elit; i++) {
                worker_pool.push_task([&p_populations, &individ_indexes](){
                    SelectRanging(p_populations, individ_indexes);
                });
             }
            worker_pool.wait_for_tasks();

            for (auto index : individ_indexes){
                auto ind = individ();
                InitIndivid(ind,classes,index, new_population.size(), temp_schedules);
                new_population.push_back(ind);
            }
            populations = new_population;
            cout << "Selection ends" << endl;
            Timer.stop();
            cout << "The elapsed time was " << Timer.ms() << " ms.\n";

            MinFitnessValue(populations, classes, bestPopulation);


            cout << "Iter: " << countIter << ", Min fitness: " << bestPopulation.fitnessValue.fitnessValue << ", Mean fitness: " << mean / arrMean.size() << endl;
            TimerRes.stop();
            //result.push_back(make_pair(result[countIter] + (int)TimerRes.ms(), bestPopulation.fitnessValue.fitnessValue));
            countIter++;


        }
        cout << setw(4) << bestPopulation.to_json() << endl;;

    }
    catch (json::parse_error& ex)
    {
        std::cerr << "parse error at byte " << ex.byte << std::endl;

    }


    return 0;
}
