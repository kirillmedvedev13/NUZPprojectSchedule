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

void SortPopulations(vector<individ> &populations, vector<clas> &classes){
    // Получить новые индексы популяций
    auto vec_individs = vector<Popul>(populations.size());
    for (size_t i =0; i < populations.size(); i++){
        vec_individs[i] = Popul(populations[i].fitnessValue, i);
    }
    sort(vec_individs.begin(), vec_individs.end());

    // Запомнить расписание для его расстоновки по сортировке
    auto tClassses = vector<vector<vector<schedule>>>(classes.size());
    for (size_t i =0; i < classes.size(); i++){
        tClassses[i] = vector<vector<schedule>>(classes[i].schedules.size());
        for (size_t j = 0; j < classes[i].schedules.size(); j++){
            tClassses[i][j] = vector<schedule>(classes[i].schedules[j].size());
            for(size_t k = 0; k < classes[i].schedules[j].size(); k++){
                tClassses[i][j][k] = classes[i].schedules[j][k];
            }
        }
    }

    // Переставить индивидов
    for (size_t i = 0; i < classes.size(); i++){
        for (size_t j = 0; j < populations.size(); j++){
            for(size_t k = 0; k < classes[i].schedules[j].size(); k++){
                int old_id_audience = tClassses[i][j][k].id_audience;
                int new_id_audience = tClassses[i][vec_individs.at(j).index][k].id_audience;
                // Поменять ссылки для аудиторий если они разные
                if(new_id_audience != old_id_audience){
                    auto ref = &classes[i].schedules[j][k];
                    auto it = find(populations[j].scheduleForAudiences[old_id_audience].begin(), populations[j].scheduleForAudiences[old_id_audience].end(), ref);
                    populations[j].scheduleForAudiences[old_id_audience].erase(it);
                    populations[j].scheduleForAudiences[new_id_audience].emplace(populations[j].scheduleForAudiences[new_id_audience].begin(), ref);
                }
                classes[i].schedules[j][k] = tClassses[i][vec_individs[j].index][k];
            }
        }
    }
    for (size_t j = 0; j < populations.size(); j++){
        populations[j].fitnessValue = vec_individs[j].fitnessValue;
    }
}

#endif
