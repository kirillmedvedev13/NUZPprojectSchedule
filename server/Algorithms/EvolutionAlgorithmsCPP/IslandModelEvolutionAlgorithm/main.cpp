#include <iostream>
#include <filesystem>
#include <fstream>
#include "../Libraries/BS_thread_pool.hpp"
#include "../Libraries/json.hpp"
#include <chrono>
#include <mutex>
#include "../Libraries/EvolutionAlgorithm.hpp"

using namespace std;
using namespace nlohmann;
using namespace BS;

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
        int number_island = data["params"]["number_islands"];
        double step =  data["params"]["step"];
        const int max_generations = data["params"]["max_generations"];
        const int population_size = data["params"]["population_size"];
        const double n_migration = data["params"]["n_migration"];
        const int len_migration = population_size*n_migration;
        const int iter_migration = data["params"]["iter_migration"];
        auto bs = base_schedule(data["base_schedule"]["schedule_group"], data["base_schedule"]["schedule_teacher"], data["base_schedule"]["schedule_audience"]);

        thread_pool worker_pool(thread::hardware_concurrency());
        timer Timer;
        Timer.start();

        double base_p_crossover = (double)data["params"]["p_crossover"];
        double base_p_mutation = (double)data["params"]["p_mutation"];
        double base_p_elitism = (double)data["params"]["p_elitism"];

        // Создание островов и их инициализация
        vector<EvolutionAlgorithm> islands;
        for (int i =0; i< number_island; i++){
            if(i != 0) {
                // Каждый остров будет иметь разные параметры
                double value_p_crossover = (i * step * base_p_crossover) / 100;
                double value_p_mutation = (i * step * base_p_mutation) / 100;
                double value_p_elitism = (i  * step * base_p_elitism) / 100;
                data["params"]["p_crossover"] = base_p_crossover + value_p_crossover;
                data["params"]["p_mutation"] = base_p_mutation + value_p_mutation;
                data["params"]["p_elitism"] = base_p_elitism + value_p_elitism;
            }
            worker_pool.push_task([&islands, &data, &bs](){
                islands.push_back(EvolutionAlgorithm(data, bs));
            });
        }
        worker_pool.wait_for_tasks();

        int countIter = 0;
        auto bestPopulation = bestIndivid();
        auto result = vector<pair<int, double>>();
        Timer.stop();
        cout << "Init " << Timer.ms() << "ms" << endl;

        auto StartTime = chrono::high_resolution_clock::now();

        while (countIter < max_generations && bestPopulation.fitnessValue.fitnessValue != 0)
        {
            Timer.start();
            for(int i =0;i<number_island;i++){
                islands[i].CrossingLoop(worker_pool);
            }
            Timer.stop();
            cout << "Crossing " << Timer.ms() << "ms" << endl;

            Timer.start();
            for(int i =0;i<number_island;i++){
                islands[i].MutationLoop(worker_pool);
            }
            Timer.stop();
            cout << "Mutation " << Timer.ms() << "ms" << endl;
            Timer.start();
            for(int i =0;i<number_island;i++){
                islands[i].FitnessLoop(worker_pool);
            }
            Timer.stop();
            cout << "Fitness " << Timer.ms() << "ms" << endl;

            Timer.start();
            for(auto &island: islands){
                worker_pool.push_task([&island](){
                    island.Selection();
                    island.MinFitnessValue();

                });
            }

            Timer.stop();
            cout << "Selection " << Timer.ms() << "ms" << endl;

            if(countIter+1 % iter_migration == 0){
                Timer.start();
                vector<vector <individ*>> bestIndivids;

                for(auto &island:islands){
                    bestIndivids.push_back(island.GetBestIndivids(len_migration));
                }

                int index;
                int sum = INT_MAX;

                for(size_t i =0; i<bestIndivids.size();i++){
                    int tempSum = 0;
                    for(individ *ind: bestIndivids[i]){
                        tempSum+=ind->fitnessValue.fitnessValue;
                    }
                    if(sum>tempSum){
                        index = i;
                        sum = tempSum;
                    }
                }

                for(size_t i =0; i<bestIndivids.size();i++){
                    //if(i!=index)
                       // islands[i].ChangeWorstIndivids(bestIndivids[index]);

                }
                Timer.stop();
                cout << "Migration " << Timer.ms() << "ms" << endl;
            }

            for(auto &island: islands){
                auto bestInIsland = island.GetBestIndivid();
                if(bestPopulation.fitnessValue.fitnessValue>bestInIsland.fitnessValue.fitnessValue){
                    bestPopulation = bestInIsland;
                }
            }

            cout << "Iter: " << ++countIter << ", Min fitness: " << bestPopulation.fitnessValue.fitnessValue << endl;
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
