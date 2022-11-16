#ifndef MINFITNESSVALUE_H
#define MINFITNESSVALUE_H

#include "TypeDefs.h"

void MinFitnessValue(const vector<individ>& populations, vector<clas> &classes, bestIndivid &bi)
{
    double min = bi.fitnessValue.fitnessValue;
    int min_index = -1;
    for(size_t i = 0; i<populations.size();i++)
    {
        if(populations[i].fitnessValue.fitnessValue<min)
        {
            min_index = i;
        }
    }
    if(min_index != -1){
        bi.arr_schedule.clear();
        for (auto &cl : classes){
            for (auto &sc : cl.schedules[min_index]){
                bi.arr_schedule.push_back(schedule(sc.number_pair,sc.day_week,sc.pair_type,sc.id_audience,sc.clas->id));
            }
        }
    }
}
#endif // MINFITNESSVALUE_H
