#include "SortSchedule.h"
#include <iostream>
using namespace std;
bool Compare(schedule a, schedule b);
void SortSchedule(vector<schedule>& i_schedule){
    int right = i_schedule.size()-1;
    while(right>0){
        for(int j =0;j<right;j++){
            if(Compare(i_schedule[j], i_schedule[j+1])){
                schedule temp = i_schedule[j+1];
                i_schedule[j+1]= i_schedule[j];
                i_schedule[j]=temp;
            }
        }
        right--;
    }
}
bool Compare(schedule a, schedule b){
    if (a.day_week > b.day_week) return true;
    if (a.day_week < b.day_week) return false;
    if (a.number_pair > b.number_pair) return true;
    if (a.number_pair < b.number_pair) return false;
    if (a.pair_type > b.pair_type) return true;
    if (a.pair_type < b.pair_type) return false;
    return false;
}
