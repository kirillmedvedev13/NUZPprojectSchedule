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
        string pathToSA;
        if (argc >= 2){
            path = argv[1];
            if (argc == 3){
                pathToSA = argv[2];
            }
        }
        else {
            path = filesystem::current_path().string();
            pathToSA = "..\\SimpleAlgorithmCPP\\SimpleAlgorithmCPP.exe";
        }
        srand(time(NULL));
        json data = json();
        ifstream fileData(path + "\\data.json");
        data = json::parse(fileData);

        // Инициализация
        const int max_generations = data["params"]["max_generations"];
        // Потоки
        thread_pool worker_pool(thread::hardware_concurrency());
        timer Timer;
        Timer.start();

        json data_SA = NULL;
        if (data["params"]["type_initialization"] == "simple_algorithm"){
            auto code = system(string(pathToSA + " " + path).c_str());
            if (code == 0){

                ifstream fileData(path + "\\result.json");
                data_SA = json::parse(fileData);
            }
            else{
                throw "Error run SimpleAlgorithm.exe";
            }
        }
        EvolutionAlgorithm mainAlgorithm(data, data_SA);

        Timer.stop();
        cout << "Init " << Timer.ms() << " ms.\n";

        int countIter = 0;
        auto best_individ = bestIndivid();
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

            cout << "Iter: " << ++countIter << ", Min fitness: " << best_individ.fitnessValue.fitnessValue << ", Mean fitness: " << mainAlgorithm.GetMeanFitnessValue() << endl;
            auto EndTime = chrono::high_resolution_clock::now();
            chrono::duration<float,std::milli> duration = EndTime - StartTime;
            result.push_back(make_pair(duration.count(), best_individ.fitnessValue.fitnessValue));
        }
        Service::SaveResults(best_individ, path, result);
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
