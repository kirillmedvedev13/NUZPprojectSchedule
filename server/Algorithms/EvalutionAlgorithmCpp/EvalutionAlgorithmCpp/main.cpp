#include <iostream>
#include "json.hpp"
#include "Init.hpp"
#include "Fitness.hpp"
#include "Crossing.hpp"
#include "Mutation.hpp"
#include "SortPopulations.hpp"
#include "GetRndDouble.hpp"
#include "GetRndInteger.hpp"
#include "MinFitnessValue.hpp"
#include "MeanFitnessValue.hpp"
#include "BS_thread_pool.hpp"
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

        while (countIter < max_generations && bestPopulation.fitnessValue.fitnessValue != 0) {
            Timer.start();
            for (int i = 0; i < population_size; i+=2){
                if (GetRndDouble() < p_crossover){
                    worker_pool.push_task([&populations, &classes, i](){
                        Crossing(populations, classes, i, i+1);
                    });
                }
            }

            worker_pool.wait_for_tasks();
            Timer.stop();
            cout << "Crossing " << Timer.ms() << "ms" << endl;

            Timer.start();
            for (int i = 0; i < population_size; i++)
            {
                if(i>299){
                    cout<<"123"<<endl;
                }
                if (GetRndDouble() <= p_mutation)
                {
                    worker_pool.push_task([&populations, &p_genes, &max_day, &max_pair, &audiences, &classes, i](){

                        Mutation(populations, i,p_genes, max_day, max_pair, audiences, classes);
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


            SortPopulations(populations, classes);

            for (const auto &cl : classes){
                temp_schedules.push_back(cl.schedules);
            }

            // Выборка турнирная
            auto individ_indexes = vector<int>();
            for (int i = 0; i < population_size-num_elit; i++){
                int i1 = 0;
                int i2 = 0;
                int i3 = 0;
                while(i1 == i2 || i2 == i3 || i1 == i3){
                    i1 = GetRndInteger(0, populations.size()-1);
                    i2 = GetRndInteger(0, populations.size()-1);
                    i3 = GetRndInteger(0, populations.size()-1);
                }
                int winIndex;
                if (populations[i1].fitnessValue.fitnessValue < populations[i2].fitnessValue.fitnessValue && populations[i1].fitnessValue.fitnessValue < populations[i3].fitnessValue.fitnessValue)
                    winIndex = i1;
                else if (populations[i2].fitnessValue.fitnessValue < populations[i1].fitnessValue.fitnessValue && populations[i2].fitnessValue.fitnessValue < populations[i3].fitnessValue.fitnessValue)
                    winIndex = i2;
                else
                    winIndex = i3;
                individ_indexes.push_back(winIndex);
            }



            for (int i = num_elit; i < population_size; i++){
                // Ссылки ссылаются на занятия, остается поменять значение занятйи на новые
                int new_index = individ_indexes[i - num_elit];
                for (size_t j =0; j < classes.size(); j++){
                    for (size_t k =0; k < temp_schedules[j][i].size(); k++){
                        auto sc = temp_schedules[j][new_index][k];
                        int old_id_audience = classes[j].schedules[i][k].id_audience;
                        int new_id_audience = sc.id_audience;
                        // Если ид аудитории поменлся, то нужно поменять ссылку на неё
                        if(new_id_audience != old_id_audience){
                            auto ref = &classes[j].schedules[i][k];
                            auto it = find(populations[i].scheduleForAudiences[old_id_audience].begin(), populations[i].scheduleForAudiences[old_id_audience].end(), ref);
                            populations[i].scheduleForAudiences[old_id_audience].erase(it);
                            populations[i].scheduleForAudiences[new_id_audience].emplace(populations[i].scheduleForAudiences[new_id_audience].begin(), ref);
                        }
                        classes[j].schedules[i][k] = sc;
                    }
                }
            }

            Timer.stop();

            cout << "Selection " << Timer.ms() << "ms" << endl;

            MinFitnessValue(populations, classes, bestPopulation);

            cout << "Iter: " << countIter << ", Min fitness: " << bestPopulation.fitnessValue.fitnessValue << ", Mean fitness: " << MeanFitnessValue(populations) << endl;
            //result.push_back(make_pair(result[countIter] + (int)TimerRes.ms(), bestPopulation.fitnessValue.fitnessValue));
            countIter++;

            for (int i =0; i < populations.size(); i++){
                for (auto &cl : classes){

                    for (auto &sc : cl.schedules[i]){
                        auto ref = &sc;
                        auto it = find(populations[i].scheduleForAudiences[sc.id_audience].begin(), populations[i].scheduleForAudiences[sc.id_audience].end(), ref);
                        if (it == populations[i].scheduleForAudiences[sc.id_audience].end()){
                            cout << "123";
                        }
                    }
                }
            }
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
