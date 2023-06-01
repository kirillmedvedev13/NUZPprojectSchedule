#include "../ServiceCPP/json.hpp"
#include "../ServiceCPP/BS_thread_pool.hpp"
#include "../ServiceCPP/TypeDefs.hpp"
#include "EvolutionAlgorithm.hpp"

#include <iostream>
#include <fstream>
#include <vector>
#include <cstring>
#include <cstdlib>
#include <chrono>
#include <filesystem>
#include <ctime>

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
        // Инициализация
        const int max_generations = data["params"]["max_generations"];

        // Потоки
        thread_pool worker_pool(thread::hardware_concurrency());
        timer Timer;

        Timer.start();

        auto bs = base_schedule(data["base_schedule"]["schedule_group"], data["base_schedule"]["schedule_teacher"], data["base_schedule"]["schedule_audience"]);

        double Seed = GetRndDouble();
        EvolutionAlgorithm mainAlgorithm(data, bs, worker_pool, Seed);

        Timer.stop();

        cout << "Init " << Timer.ms() << " ms.\n";

        int countIter = 0;
        auto best_individ = bestIndivid();
        // Значение фитнесса и время
        auto result = vector<pair<int, double>>();

        auto StartTime = chrono::high_resolution_clock::now();
        while (countIter < max_generations && best_individ.fitnessValue.fitnessValue != 0)
        {
            Timer.start();

            mainAlgorithm.CrossingLoop(worker_pool);

            Timer.stop();

            cout << "Crossing " << Timer.ms() << "ms" << endl;

            Timer.start();

            mainAlgorithm.MutationLoop(worker_pool);

            Timer.stop();

            cout << "Mutation " << Timer.ms() << "ms" << endl;

            Timer.start();

            mainAlgorithm.FitnessLoop(worker_pool);

            Timer.stop();

            cout << "Fitness " << Timer.ms() << "ms" << endl;

            Timer.start();

            mainAlgorithm.SelectionLoop(worker_pool);

            Timer.stop();

            cout << "Selection " << Timer.ms() << "ms" << endl;

            best_individ = mainAlgorithm.GetBestIndivid();

            cout << "Iter: " << ++countIter << ", Min fitness: " << best_individ.fitnessValue.fitnessValue << ", Mean fitness: " << mainAlgorithm.MeanFitnessValue() << endl;
            auto EndTime = chrono::high_resolution_clock::now();
            chrono::duration<float,std::milli> duration = EndTime - StartTime;
            result.push_back(make_pair(duration.count(), best_individ.fitnessValue.fitnessValue));
        }
        json resultJson = json();
        resultJson["bestPopulation"] = best_individ.to_json();
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
