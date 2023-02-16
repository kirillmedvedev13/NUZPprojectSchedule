#ifndef CROSSING_H
#define CROSSING_H

#include "TypeDefs.h"
#include "GetRndInteger.hpp"
#include <set>
#include <iostream>
#include <map>
using namespace std;

void Crossing(vector<individ>& populations, vector<clas>& classes, const int &index1,const int &index2)
{
    if (classes.size() > 1){
        int index_class = GetRndInteger(0, classes.size()-1);
        int index_pair = GetRndInteger(0, classes[index_class].schedules[index1].size()-1);
            // Если аудитории разные, то менять указатели для каждой аудитории
            if (classes[index_class].schedules[index1][index_pair].id_audience != classes[index_class].schedules[index2][index_pair].id_audience){
                // Найти ссылку на занятие для 1 аудитории и удалить
                auto id_aud1 = classes[index_class].schedules[index1][index_pair].id_audience;
                auto ref1 = &classes[index_class].schedules[index1][index_pair];
                auto it1 = find(populations[index1].scheduleForAudiences[id_aud1].begin(), populations[index1].scheduleForAudiences[id_aud1].end(), ref1);
                populations[index1].scheduleForAudiences[id_aud1].erase(it1);
                // Найти ссылку на занятие для 2 аудитории и удалить
                auto id_aud2 = classes[index_class].schedules[index2][index_pair].id_audience;
                auto ref2 = &classes[index_class].schedules[index2][index_pair];
                auto it2 = find(populations[index2].scheduleForAudiences[id_aud2].begin(), populations[index2].scheduleForAudiences[id_aud2].end(), ref2);
                populations[index2].scheduleForAudiences[id_aud2].erase(it2);

                // Вставить новые ссылки для аудиторий
                populations[index1].scheduleForAudiences[id_aud2].emplace(populations[index1].scheduleForAudiences[id_aud2].begin(), ref1);
                populations[index2].scheduleForAudiences[id_aud1].emplace(populations[index2].scheduleForAudiences[id_aud1].begin(), ref2);

            }
            // Поменять параметры занятий между друг другом
            auto sc1 = classes[index_class].schedules[index1][index_pair];
            classes[index_class].schedules[index1][index_pair] = classes[index_class].schedules[index2][index_pair];
            classes[index_class].schedules[index2][index_pair] = sc1;

    }
}

#endif
