#include "../ServiceCPP/BS_thread_pool.hpp"
#include "../ServiceCPP/json.hpp"
#include "IslandModelEvolutionAlgorithm.hpp"
#include "../ServiceCPP/Service.hpp"

#include <iostream>
#include <filesystem>
#include <fstream>
#include <chrono>
#include <climits>

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

        int number_island = data["params"]["number_islands"];
        double step =  data["params"]["step"];
        // Инициализация
        const int max_generations = data["params"]["max_generations"];
        const int population_size = data["params"]["population_size"];
        const double n_migration = data["params"]["n_migration"];
        const int len_migration = population_size*n_migration;
        const int iter_migration = data["params"]["iter_migration"];

        thread_pool worker_pool(thread::hardware_concurrency());
        timer Timer;
        Timer.start();

        double base_p_crossover = (double)data["params"]["p_crossover"];
        double base_p_mutation = (double)data["params"]["p_mutation"];
        double base_p_elitism = (double)data["params"]["p_elitism"];
        // Создание островов с разными параметрами и их инициализация
        json data_SA = json();
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
        vector<IslandModelEvolutionAlgorithm> islands;
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
            islands.push_back(IslandModelEvolutionAlgorithm(data, data_SA));
        }

        Timer.stop();
        cout << "Init " << Timer.ms() << "ms" << endl;

        int countIter = 0;
        auto best_individ = bestIndivid();
        auto result = vector<pair<int, double>>();
        auto StartTime = chrono::high_resolution_clock::now();

        while (countIter < max_generations && best_individ.fitnessValue.fitnessValue != 0)
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
                island.SelectionLoop(worker_pool);
            }

            Timer.stop();
            cout << "Selection " << Timer.ms() << "ms" << endl;

            //Миграция между популяциями
            if((countIter + 1) % iter_migration == 0){
                Timer.start();
                auto islandsBestIndivids = vector<vector<pair<vector<vector<schedule>>,int>>>();

                for(auto &island : islands){
                    islandsBestIndivids.push_back(island.GetBestIndivids(len_migration));
                }
                //Поиск лучшего острова
                int best_index = -1;
                double sum = DBL_MAX;
                for(auto i = 0; i < number_island; i++){
                    double tempSum = 0;
                    for(auto &ind: islandsBestIndivids[i]){
                        tempSum += ind.second;
                    }
                    if(sum > tempSum){
                        best_index = i;
                        sum = tempSum;
                    }
                }
                // Замена индивидов у всех островов кроме лучшего
                for(auto i = 0; i < number_island; i++){
                    if(i != best_index) {
                        islands[i].ChangeWorstIndivids(islandsBestIndivids[best_index]);
                    }
                }
                Timer.stop();
                cout << "Migration " << Timer.ms() << "ms" << endl;
            }
            // Выборка лучшего индивида
            for(auto &island: islands){
                auto bestInIsland = island.GetBestIndivid();
                if(best_individ.fitnessValue.fitnessValue > bestInIsland.fitnessValue.fitnessValue){
                    best_individ = bestInIsland;
                }
            }

            cout << "Iter: " << ++countIter << ", Min fitness: " << best_individ.fitnessValue.fitnessValue << endl;
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
