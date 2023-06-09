#ifndef SIMULATEDANNEALING_HPP
#define SIMULATEDANNEALING_HPP

#include "../ServiceCPP/Service.hpp"
#include "../ServiceCPP/json.hpp"

class SimulatedAnnealing : public Service{
public:
    double alpha;
    double temperature;
    SimulatedAnnealing(){}
    SimulatedAnnealing(json data){
        InitServiceWithInitAndMut(data, 2);
        this->temperature = data["params"]["temperature"];
        this->alpha = data["params"]["alpha"];
    }
    void UpdateTemperature(){
        this->temperature = alpha * this->temperature;
    }
};

#endif // SIMULATEDANNEALING_H
