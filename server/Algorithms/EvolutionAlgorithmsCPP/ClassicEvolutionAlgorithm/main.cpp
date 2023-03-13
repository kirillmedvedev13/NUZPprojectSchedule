#include <iostream>
#include "../Libraries/json.hpp"

#include "../Libraries/BS_thread_pool.hpp"
#include "../Libraries/TypeDefs.hpp"
#include "../Libraries/EvolutionAlgorithm.hpp"
#include <fstream>
#include <vector>
#include <cstring>
#include <cstdlib>
#include <chrono>
#include <filesystem>
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

        EvolutionAlgorithm mainAlgorithm(data, bs);

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

            mainAlgorithm.CrossingLoop(worker_pool);

            worker_pool.wait_for_tasks();

            Timer.stop();
            cout << "Crossing " << Timer.ms() << "ms" << endl;

            Timer.start();

            mainAlgorithm.MutationLoop(worker_pool);

            worker_pool.wait_for_tasks();
            Timer.stop();
            cout << "Mutation " << Timer.ms() << "ms" << endl;

            Timer.start();

            mainAlgorithm.FitnessLoop(worker_pool);

            worker_pool.wait_for_tasks();
            Timer.stop();
            cout << "Fitness " << Timer.ms() << "ms" << endl;

            Timer.start();

            mainAlgorithm.Selection();


            Timer.stop();
            cout << "Selection " << Timer.ms() << "ms" << endl;

            mainAlgorithm.MinFitnessValue();

            bestPopulation = mainAlgorithm.GetBestIndivid();

            cout << "Iter: " << ++countIter << ", Min fitness: " << bestPopulation.fitnessValue.fitnessValue << ", Mean fitness: " << mainAlgorithm.MeanFitnessValue() << endl;
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
