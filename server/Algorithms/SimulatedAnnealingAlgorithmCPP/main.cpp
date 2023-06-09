#include <iostream>
#include <filesystem>
#include <cmath>

#include "../ServiceCPP/json.hpp"
#include "SimulatedAnnealing.hpp"


using namespace std;
using namespace nlohmann;

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

        int countIter = 0;
        auto best_individ = bestIndivid();
        auto result = vector<pair<int, double>>();
        auto StartTime = chrono::high_resolution_clock::now();

        SimulatedAnnealing mainAlgorithm(data);
        mainAlgorithm.InitBaseSchedule(data);
        mainAlgorithm.InitClasses(0, data_SA);
        mainAlgorithm.InitPopulations(0);

        while (mainAlgorithm.populations[0].fitnessValue.fitnessValue != 0) {
            mainAlgorithm.ClearIndivid(1);
            mainAlgorithm.SetIndivid(1, 0);
            mainAlgorithm.InitPopulations(1);
            mainAlgorithm.Mutation(1);
            mainAlgorithm.Fitness(0);
            auto fitness = mainAlgorithm.populations[0].fitnessValue.fitnessValue;

            mainAlgorithm.Fitness(1);
            auto new_fitness = mainAlgorithm.populations[1].fitnessValue.fitnessValue;

            auto difference = new_fitness - fitness;
            if (difference < 0){
                mainAlgorithm.ClearIndivid(0);
                mainAlgorithm.SetIndivid(0, 1);
                mainAlgorithm.InitPopulations(0);
            } else{
                if (GetRndDouble() < exp(-difference / mainAlgorithm.temperature)){
                    mainAlgorithm.ClearIndivid(0);
                    mainAlgorithm.SetIndivid(0, 1);
                    mainAlgorithm.InitPopulations(0);
                }
            }

            mainAlgorithm.UpdateTemperature();
            ++countIter;
            if (countIter % 100 == 0){
                cout << "Iter: " << countIter << " , fitness: " << mainAlgorithm.populations[0].fitnessValue.fitnessValue << " , temp: " << mainAlgorithm.temperature << endl;
                auto EndTime = chrono::high_resolution_clock::now();
                chrono::duration<float,std::milli> duration = EndTime - StartTime;
                result.push_back(make_pair(duration.count(), mainAlgorithm.populations[0].fitnessValue.fitnessValue));
            }
        }
        best_individ = mainAlgorithm.GetBestIndivid();
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
