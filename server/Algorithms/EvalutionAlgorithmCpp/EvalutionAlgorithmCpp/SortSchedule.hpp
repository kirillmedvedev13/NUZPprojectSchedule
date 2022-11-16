#ifndef SORTSCHEDULE_H
#define SORTSCHEDULE_H

#include "TypeDefs.h"
#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

bool Compare(schedule *a, schedule *b){
    if (a->day_week > b->day_week) return true;
    if (a->day_week < b->day_week) return false;
    if (a->number_pair > b->number_pair) return true;
    if (a->number_pair < b->number_pair) return false;
    if (a->pair_type > b->pair_type) return true;
    if (a->pair_type < b->pair_type) return false;
    return false;
}

void SortSchedule(vector<schedule*>& i_schedule){
    sort(i_schedule.begin(),i_schedule.end(),Compare);
}


#endif // SORTSCHEDULE_H
