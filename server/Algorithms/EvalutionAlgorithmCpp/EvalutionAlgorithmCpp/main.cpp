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
#include <chrono>
#include <mutex>
#include <filesystem>
using namespace std;
using namespace nlohmann;
using namespace BS;

mutex mtx;

int main(int argc,char* argv[])
{
    try
    {
        string path;
        if (argc == 2){
            path = argv[1];
        }
        else {
            path = filesystem::current_path().string();
        }
        json data = json();
        ifstream fileData(path + "\\data.json");
        data = json::parse(fileData);
        // Инициализация
        const int max_day = data["max_day"];
        const int max_pair = data["max_pair"];

        const json evolution_values = data["params"];
        const int population_size = evolution_values["population_size"];
        const int max_generations = evolution_values["max_generations"];
        const double p_crossover = evolution_values["p_crossover"];
        const double p_mutation = evolution_values["p_mutation"];
        const double p_elitism = evolution_values["p_elitism"];

        const json general_values = data["general_values"];
        const double penaltySameRecSc = general_values["penaltySameRecSc"];
        const double penaltyGrWin = general_values["penaltyGrWin"];
        const double penaltyTeachWin = general_values["penaltyTeachWin"];
        const double penaltySameTimesSc = general_values["penaltySameTimesSc"];
        const int num_elit = population_size * p_elitism;

        vector<clas> classes = vector<clas>();
        for (json cl : data["classes"])
        {
            classes.push_back(clas(cl, population_size));
        }

        vector<audience> audiences = vector<audience>();
        for (json &aud : data["audiences"])
        {
            audience new_aud(aud);
            audiences.push_back(new_aud);
        }

        base_schedule bs = base_schedule(data["base_schedule"]["schedule_group"], data["base_schedule"]["schedule_teacher"], data["base_schedule"]["schedule_audience"]);
        // Потоки
        thread_pool worker_pool(thread::hardware_concurrency());
        timer Timer;
        Timer.start();

        // В каждом классе хранится массив занятий для индивида, на который ссылаются индивиды, то есть изменение расписания влечет изменение данных у всех
        auto populations = Init(classes, max_day, max_pair, population_size, audiences, bs);
        Timer.stop();
        cout << "Init " << Timer.ms() << " ms.\n";
        int countIter = 0;
        auto bestPopulation = bestIndivid();
        // Значение фитнесса и время
        auto result = vector<pair<int, double>>();

        auto StartTime = chrono::high_resolution_clock::now();
        while (countIter < max_generations && bestPopulation.fitnessValue.fitnessValue != 0)
        {
            Timer.start();
            for (int i = 0; i < population_size; i += 2)
            {
                if (GetRndDouble() < p_crossover)
                {
                    worker_pool.push_task([&populations, &classes, i]()
                    {
                        Crossing(populations, classes, i, i + 1);
                    });
                }
            }

            worker_pool.wait_for_tasks();
            Timer.stop();
            cout << "Crossing " << Timer.ms() << "ms" << endl;

            Timer.start();
            for (int i = 0; i < population_size; i++)
            {
                if (GetRndDouble() <= p_mutation)
                {
                    worker_pool.push_task([&populations, &max_day, &max_pair, &audiences, &classes, i]()
                    {
                        Mutation(populations, i, max_day, max_pair, audiences, classes);
                    });
                }
            }
            worker_pool.wait_for_tasks();
            Timer.stop();
            cout << "Mutation " << Timer.ms() << "ms" << endl;

            Timer.start();
            for (int i = 0; i < population_size; i++)
            {
                auto &ind = populations[i];
                worker_pool.push_task([&ind, &max_day, &penaltySameRecSc, &penaltyGrWin, &penaltySameTimesSc, &penaltyTeachWin, &i, &classes]()
                {
                    Fitness(ind, max_day, classes, i, penaltySameRecSc, penaltyGrWin, penaltySameTimesSc, penaltyTeachWin);
                });
            }
            worker_pool.wait_for_tasks();
            Timer.stop();
            cout << "Fitness " << Timer.ms() << "ms" << endl;

            Timer.start();

            SortPopulations(populations, classes);

            // Выборка турнирная
            auto individ_indexes = vector<int>();
            for (int i = 0; i < population_size - num_elit; i++)
            {
                int i1 = 0;
                int i2 = 0;
                int i3 = 0;
                while (i1 == i2 || i2 == i3 || i1 == i3)
                {
                    i1 = GetRndInteger(0, populations.size() - 1);
                    i2 = GetRndInteger(0, populations.size() - 1);
                    i3 = GetRndInteger(0, populations.size() - 1);
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


            // Запомнить расписание для его расстоновки по сортировке
            auto temp_classes = vector<vector<vector<schedule>>>(classes.size());
            for (size_t i =0; i < classes.size(); i++){
                temp_classes[i] = vector<vector<schedule>>(classes[i].schedules.size());
                for (size_t j = 0; j < classes[i].schedules.size(); j++){
                    temp_classes[i][j] = vector<schedule>(classes[i].schedules[j].size());
                    for(size_t k = 0; k < classes[i].schedules[j].size(); k++){
                        temp_classes[i][j][k] = classes[i].schedules[j][k];
                    }
                }
            }

            for (int i = num_elit; i < population_size; i++)
            {
                // Ссылки ссылаются на занятия, остается поменять значение занятий на новые
                int new_index = individ_indexes[i - num_elit];
                for (size_t j = 0; j < classes.size(); j++)
                {
                    for (size_t k = 0; k < classes[j].schedules[i].size(); k++)
                    {
                        auto sc = temp_classes[j][new_index][k];
                        int old_id_audience = classes[j].schedules[i][k].id_audience;
                        int new_id_audience = sc.id_audience;
                        // Если ид аудитории поменялся, то нужно поменять ссылку на неё
                        if (new_id_audience != old_id_audience)
                        {
                            auto ref = &classes[j].schedules[i][k];
                            auto it = find(populations[i].scheduleForAudiences[old_id_audience].begin(), populations[i].scheduleForAudiences[old_id_audience].end(), ref);
                            populations[i].scheduleForAudiences[old_id_audience].erase(it);
                            populations[i].scheduleForAudiences[new_id_audience].emplace(populations[i].scheduleForAudiences[new_id_audience].begin(), ref);
                        }
                        // Поменять значение пары
                        classes[j].schedules[i][k] = sc;
                    }
                }
            }

            Timer.stop();
            cout << "Selection " << Timer.ms() << "ms" << endl;

            MinFitnessValue(populations, classes, bestPopulation);

            cout << "Iter: " << ++countIter << ", Min fitness: " << bestPopulation.fitnessValue.fitnessValue << ", Mean fitness: " << MeanFitnessValue(populations) << endl;
            auto EndTime = chrono::high_resolution_clock::now();
            chrono::duration<float,std::milli> duration = EndTime - StartTime;
            result.push_back(make_pair(duration.count(), bestPopulation.fitnessValue.fitnessValue));
        }
        json resultJson = json();
        resultJson["bestPopulation"] = bestPopulation.to_json();
        resultJson["result"] = result;
        ofstream fileResult(path+"\\result.json");
        if (fileResult.is_open()){
            fileResult << resultJson << endl;
        }
    }
    catch (exception &ex)
    {
        cout << ex.what() << endl;
    }
    catch (...)
    {
        cout << "any mistake" << endl;
    }

    return 0;
}
