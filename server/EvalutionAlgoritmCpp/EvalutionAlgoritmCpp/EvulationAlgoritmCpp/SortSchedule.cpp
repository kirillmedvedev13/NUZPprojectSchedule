#include "SortSchedule.h"
#include <iostream>
using namespace std;
bool Compare(json a, json b);
void SortSchedule(vector<json> &schedule){
    int right = schedule.size()-1;
    while(right>0){
        for(int j =0;j<right;j++){
            if(Compare(schedule[j],schedule[j+1])){
                json temp = schedule[j+1];
                schedule[j+1]=schedule[j];
                schedule[j]=temp;
            }
        }
        right--;
    }
}
bool Compare(json a, json b){
    if (a["day_week"] > b["day_week"]) return 1;
    if (a["day_week"] < b["day_week"]) return -1;
    if (a["number_pair"] > b["number_pair"]) return 1;
    if (a["number_pair"] < b["number_pair"]) return -1;
    if (a["pair_type"] > b["pair_type"]) return 1;
    if (a["pair_type"] < b["pair_type"]) return -1;
    return 0;
}
