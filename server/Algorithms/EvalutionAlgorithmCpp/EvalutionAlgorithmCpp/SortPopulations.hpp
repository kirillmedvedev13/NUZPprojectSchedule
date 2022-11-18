#ifndef SORTPOPULATIONS_H
#define SORTPOPULATIONS_H

#include "TypeDefs.h"
#include <vector>
using namespace std;

struct Popul{
    fitness fitnessValue;
    int index;
    Popul(){
        fitnessValue = fitness();
        index = -1;
    }
    Popul(fitness fitnessValue,  int index){
        this->fitnessValue = fitnessValue;
        this->index = index;
    }
    bool operator < (const Popul &b){
        if (this->fitnessValue.fitnessValue < b.fitnessValue.fitnessValue) return true;
        else return false;
    }
};

struct ComparePopul{

};


void SortPopulations(vector<individ> &populations, vector<clas> &classes){
    auto t = vector<Popul>(populations.size());
    for (size_t i =0; i < populations.size(); i++){
        t[i] = Popul(populations[i].fitnessValue, i);
    }
    sort(t.begin(), t.end());
    auto tClassses = vector<vector<vector<schedule>>>(classes.size());
    // Запомнить расписание для его расстоновки по сортировке
    for (size_t i =0; i < classes.size(); i++){
        tClassses[i] = vector<vector<schedule>>(classes[i].schedules.size());
        for (size_t j = 0; j < classes[i].schedules.size(); j++){
            tClassses[i][j] = vector<schedule>(classes[i].schedules[j].size());
            for(size_t k = 0; k < classes[i].schedules[j].size(); k++){
                tClassses[i][j][k] = classes[i].schedules[j][k];
            }
        }
    }
    for (size_t i =0; i < tClassses.size(); i++){
        for (size_t j = 0; j < t.size(); j++){
            for(size_t k = 0; k < tClassses[i][j].size(); k++){
                int old_id_audience = classes[i].schedules[j][k].id_audience;
                int new_id_audience = tClassses[i][t[j].index][k].id_audience;
                // Поменять ссылки для аудиторий
                if(new_id_audience != old_id_audience){
                    auto ref = &classes[i].schedules[j][k];
                    auto it = find(populations[j].scheduleForAudiences[old_id_audience].begin(), populations[i].scheduleForAudiences[old_id_audience].end(), ref);
                    populations[j].scheduleForAudiences[old_id_audience].erase(it);
                    populations[j].scheduleForAudiences[new_id_audience].emplace(populations[j].scheduleForAudiences[new_id_audience].begin(), ref);
                }
                classes[i].schedules[j][k] = tClassses[i][t[j].index][k];
            }
        }
    }
    for (size_t j = 0; j < t.size(); j++){
        populations[j].fitnessValue = t[j].fitnessValue;
    }
}

#endif
