#include "../ServiceCPP/json.hpp"
#include "../ServiceCPP/Service.hpp"
#include "../ServiceCPP/TypeDefs.hpp"
#include "TabuSearch.hpp"

#include <iostream>
#include <filesystem>
#include <fstream>
#include <chrono>

using namespace std;

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
        json data_SA=NULL;
        TabuSearch mainAlgorithm;
        if (data["params"]["type_initialization"] == "simple_algorithm"){
            auto code = system(string(pathToSA + " " + path).c_str());
            if (code == 0){
                data_SA = json();
                ifstream fileData(path + "\\result.json");
                data_SA = json::parse(fileData);
            }
            else{
                throw "Error run SimpleAlgorithm.exe";
            }
        }
        timer Timer;
        Timer.start();
        mainAlgorithm = TabuSearch(data,Timer,data_SA);
        auto result = vector<pair<int, double>>();
        auto best_individ = mainAlgorithm.MainLoop(data,Timer,result);
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
