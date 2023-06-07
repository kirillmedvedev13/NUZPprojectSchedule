#include "../ServiceCPP/json.hpp"
#include "../ServiceCPP/Service.hpp"
#include "../ServiceCPP/TypeDefs.hpp"
#include "SimpleAlgorithm.hpp"

#include <iostream>
#include <filesystem>
#include <fstream>
#include <chrono>

using namespace std;

int main(int argc,char* argv[])
{
    try
    {
        auto StartTime = chrono::high_resolution_clock::now();
        string path;
        if (argc == 2){
            path = argv[1];
        }
        else {
            path = filesystem::current_path().string();
        }
        srand(time(NULL));
        json data = json();
        ifstream fileData(path + "\\data.json");
        data = json::parse(fileData);
        // Значение время и фитнесса
        auto result = vector<pair<int, double>>();

        auto SA = SimpleAlgorithm(data);

        SA.Fitness(0);

        auto best_individ = SA.GetBestIndivid();

        auto EndTime = chrono::high_resolution_clock::now();
        chrono::duration<float,std::milli> duration = EndTime - StartTime;
        result.push_back(make_pair(duration.count(), best_individ.fitnessValue.fitnessValue));

        cout << "Simple Algorithm: " << " fitness: " << best_individ.fitnessValue.fitnessValue << endl;

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
