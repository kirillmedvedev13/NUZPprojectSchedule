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
    if (classes.size() > 2){
        int start = GetRndInteger(0, classes.size()/ 2);
        int end = GetRndInteger(start, (classes.size() - 1));
        for(int i = start;i<end;i++){
            for (size_t j = 0; j < classes[i].schedules[index1].size(); j++){
                // Если аудитории разные, то менять указатели для каждой аудитории
                if (classes[i].schedules[index1][j].id_audience != classes[i].schedules[index2][j].id_audience){
                    auto id_aud1 = classes[i].schedules[index1][j].id_audience;
                    auto ref1 = &classes[i].schedules[index1][j];
                    auto it1 = find(populations[index1].scheduleForAudiences[id_aud1].begin(), populations[index1].scheduleForAudiences[id_aud1].end(), ref1);
                    populations[index1].scheduleForAudiences[id_aud1].erase(it1);
                    auto id_aud2 = classes[i].schedules[index2][j].id_audience;
                    auto ref2 = &classes[i].schedules[index2][j];
                    auto it2 = find(populations[index2].scheduleForAudiences[id_aud2].begin(), populations[index2].scheduleForAudiences[id_aud2].end(), ref2);
                    populations[index2].scheduleForAudiences[id_aud2].erase(it2);


                    populations[index1].scheduleForAudiences[id_aud2].emplace(populations[index1].scheduleForAudiences[id_aud2].begin(), ref1);
                    populations[index2].scheduleForAudiences[id_aud1].emplace(populations[index2].scheduleForAudiences[id_aud1].begin(), ref2);

                }
                auto sc1 = classes[i].schedules[index1][j];
                classes[i].schedules[index1][j] = classes[i].schedules[index2][j];
                classes[i].schedules[index2][j] = sc1;

            }
        }
    }
}

#endif
