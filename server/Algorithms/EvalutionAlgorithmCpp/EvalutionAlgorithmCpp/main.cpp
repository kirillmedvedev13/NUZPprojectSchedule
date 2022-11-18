#include <iostream>
#include "json.hpp"
#include "Init.hpp"
#include "Fitness.hpp"
#include "Crossing.hpp"
#include "Mutation.hpp"
#include "SortPopulations.hpp"
#include "SelectRanging.hpp"
#include "GetRndDouble.hpp"
#include "GetRndInteger.hpp"
#include "MinFitnessValue.hpp"
#include "MeanFitnessValue.hpp"
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

mutex mtx;

int main()
{
    try
    {
        json data = json();
        ifstream fileData("data.json");
        data = json::parse(fileData);

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
        for (json &aud : data["audiences"]) {
            audience new_aud(aud);
            audiences.push_back(new_aud);
        }

        base_schedule bs = base_schedule(data["base_schedule"]["schedule_group"],data["base_schedule"]["schedule_teacher"], data["base_schedule"]["schedule_audience"]);

        thread_pool worker_pool(thread::hardware_concurrency());
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
        auto bestPopulation = bestIndivid();
        map<string, double> temp;
        vector<pair<int, int>> result = vector<pair<int, int>>();
        result.push_back(make_pair(0,0));

        while (countIter < max_generations && bestPopulation.fitnessValue.fitnessValue != 0)
        {
            TimerRes.start();
            Timer.start();

            for (int i = 0; i < population_size; i+=2)
            {
                if (GetRndDouble() < p_crossover)
                {
                    auto &ind1 = populations[i];
                    auto &ind2 = populations[i+1];
                    worker_pool.push_task([&ind1, &ind2, &classes, i](){
                        Crossing(ind1, ind2, classes, i, i+1);
                    });
                }
            }

            worker_pool.wait_for_tasks();
            Timer.stop();
            cout << "Crossing " << Timer.ms() << "ms" << endl;

            Timer.start();
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
            Timer.stop();
            cout << "Mutation " << Timer.ms() << "ms" << endl;;

            Timer.start();
            for (int i = 0; i < population_size; i++)
            {
                auto &ind = populations[i];
                worker_pool.push_task([&ind, &max_day, &penaltySameRecSc, &penaltyGrWin, &penaltySameTimesSc, &penaltyTeachWin, &i, &classes](){
                    Fitness(ind, max_day, classes, i, penaltySameRecSc, penaltyGrWin, penaltySameTimesSc, penaltyTeachWin);
                });
            }
            worker_pool.wait_for_tasks();
            Timer.stop();
            cout << "Fitness " << Timer.ms() << "ms" << endl;

            Timer.start();

            auto temp_schedules = vector<vector<vector<schedule>>>();
            for (auto cl : classes){
                temp_schedules.push_back(cl.schedules);
            }

            SortPopulations(populations);
            vector<individ> new_population;
            for (int i = 0; i < num_elit; i++)
            {
                auto ind = individ();
                InitIndivid(ind,classes,i, new_population.size(), temp_schedules, bs);
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
                InitIndivid(ind,classes,index, new_population.size(), temp_schedules, bs);
                new_population.push_back(ind);
            }
            populations = new_population;
            Timer.stop();
            cout << "Selection " << Timer.ms() << "ms" << endl;

            MinFitnessValue(populations, classes, bestPopulation);

            cout << "Iter: " << countIter << ", Min fitness: " << bestPopulation.fitnessValue.fitnessValue << ", Mean fitness: " << MeanFitnessValue(populations) << endl;
            TimerRes.stop();
            //result.push_back(make_pair(result[countIter] + (int)TimerRes.ms(), bestPopulation.fitnessValue.fitnessValue));
            countIter++;
        }
        cout << setw(4) << bestPopulation.to_json() << endl;;

    }
    catch (exception &ex)
    {
        cout << ex.what() << endl;

    }
    catch(...){
        cout << "any mistake" << endl;
    }

    return 0;
}
