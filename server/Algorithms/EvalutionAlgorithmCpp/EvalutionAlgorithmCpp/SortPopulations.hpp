#ifndef SORTPOPULATIONS_H
#define SORTPOPULATIONS_H

#include "TypeDefs.h"
#include <vector>
using namespace std;

bool Compare(const individ &a,const individ &b){
    if (a.fitnessValue.fitnessValue <= b.fitnessValue.fitnessValue) return true;
    else return false;
}

void SortPopulations(vector<individ> &populations, vector<clas> &classes){
    for (size_t i =0; i < populations.size(); i++){
        for (size_t j = 0; j < populations.size() - 1; j++){
            if (!Compare(populations[j], populations[j+1])){
                // Ссылки остаются, меняется значение этих ссылок
                for (auto &cl : classes){
                    auto t = cl.schedules[j];
                    cl.schedules[j] = cl.schedules[j+1];
                    cl.schedules[j+1] = t;
                }
                auto t = populations[j].fitnessValue;
                populations[j].fitnessValue = populations[j+1].fitnessValue;
                populations[j+1].fitnessValue = t;
            }
        }
    }
}

#endif
