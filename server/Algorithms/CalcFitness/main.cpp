#include "../ServiceCPP/json.hpp"
#include "../ServiceCPP/Service.hpp"
#include "../ServiceCPP/TypeDefs.hpp"

#include <iostream>
#include <filesystem>
#include <fstream>

using namespace std;

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
        auto ser = Service();
        ser.InitService(data, 1);

        for (auto &sc : data["schedules"]){
            int id_class = sc["id_class"];
            auto find_cl = find_if(ser.classes.begin(), ser.classes.end(), [&id_class](clas &cl){
                return cl.id == id_class;
            });
            find_cl->schedules[0].push_back(schedule(sc["number_pair"], sc["day_week"], sc["pair_type"], sc["id_audience"], id_class));
        }

        ser.InitPopulations(0);
        ser.Fitness(0);
        auto fit= ser.populations[0].fitnessValue;
        json resultJson = json();
        resultJson["fitnessValue"] = fit.to_json();
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
