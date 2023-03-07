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

        while (countIter < max_generations && bestPopulation.fitnessValue.fitnessValue != 0)
        {
            Timer.start();
            for(int i =0;i<number_island;i++){
                worker_pool.push_task([&islands,i](){
                    islands[i].CrossingLoop();
                });
            }
            worker_pool.wait_for_tasks();
            Timer.stop();
            cout << "Crossing " << Timer.ms() << "ms" << endl;
            cout << "Iter: " << ++countIter << endl;
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
