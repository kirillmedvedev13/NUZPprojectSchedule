#include <iostream>
#include <filesystem>
#include <fstream>
#include "BS_thread_pool.hpp"
#include "EvalutionAlgorithm.h"
#include "json.hpp"
#include <chrono>
#include <mutex>

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
        int number_island = data["number_island"];
        const int max_generations = data["params"]["max_generations"];

        thread_pool worker_pool(thread::hardware_concurrency());
        timer Timer;
        Timer.start();

        vector<EvalutionAlgorithm> islands;
        for (int i =0;i< number_island;i++){
            worker_pool.push_task([&islands,&data](){
                islands.push_back(EvalutionAlgorithm(data));
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

            for(auto &island: islands){
                auto bestInIsland = island.GetBestPopulation();
                if(bestPopulation.fitnessValue.fitnessValue>bestInIsland.fitnessValue.fitnessValue){
                    bestPopulation = bestInIsland;
                }
            }

            cout << "Iter: " << ++countIter << ", Min fitness: " << bestPopulation.fitnessValue.fitnessValue << endl;
            auto EndTime = chrono::high_resolution_clock::now();
            chrono::duration<float,std::milli> duration = EndTime - StartTime;
            result.push_back(make_pair(duration.count(), bestPopulation.fitnessValue.fitnessValue));

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
