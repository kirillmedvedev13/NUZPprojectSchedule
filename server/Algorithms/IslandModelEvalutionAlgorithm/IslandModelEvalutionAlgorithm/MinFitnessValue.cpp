#include "EvalutionAlgorithm.h"

void EvalutionAlgorithm::MinFitnessValue()
{
    double min = bestPopulation.fitnessValue.fitnessValue;
    int min_index = -1;
    for(size_t i = 0; i<populations.size();i++)
    {
        if(populations[i].fitnessValue.fitnessValue<min)
        {
            min_index = i;
            min = populations[i].fitnessValue.fitnessValue;
        }
    }
    if(min_index != -1){
        bestPopulation.arr_schedule.clear();
        bestPopulation.fitnessValue = populations[min_index].fitnessValue;
        for (auto &cl : classes){
            for (auto &sc : cl.schedules[min_index]){
                bestPopulation.arr_schedule.push_back(schedule(sc.number_pair,sc.day_week,sc.pair_type,sc.id_audience,sc.id_class));
            }
        }
    }
}
