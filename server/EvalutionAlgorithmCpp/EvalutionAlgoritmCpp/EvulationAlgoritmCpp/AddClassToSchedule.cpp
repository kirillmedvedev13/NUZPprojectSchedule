#include "AddClassToSchedule.h"
#include <vector>
#include <iostream>
using namespace std;
json AddClassToSchedule(json &schedule, json clas, int day_week, int number_pair, int pair_type, int id_audience)
{
    map<int, vector<json>> scheduleForGroups = schedule["scheduleForGroups"];
    map<int, vector<json>> scheduleForTeachers = schedule["scheduleForTeachers"];
    map<int, vector<json>> scheduleForAudiences = schedule["scheduleForAudiences"];
    for (json ag : clas["assigned_groups"])
    {
        vector<json> temp = scheduleForGroups[(int)ag["id_group"]];

        temp.push_back({{"number_pair", number_pair},
                        {"day_week", day_week},
                        {"pair_type", pair_type},
                        {"id_audience", id_audience},
                        {"id_assigned_group", ag["id"]},
                        {"id_class", clas["id"]}});
        if(temp ==NULL){
            cout<<endl;
        }

        scheduleForGroups[(int)ag["id_group"]] = temp;
    }
    for (json at : clas["assigned_teachers"])
    {
        vector<json> temp = scheduleForTeachers[(int)at["id_teacher"]];

        temp.push_back({{"number_pair", number_pair},
                        {"day_week", day_week},
                        {"pair_type", pair_type},
                        {"id_audience", id_audience},
                        {"id_class", clas["id"]}});

        scheduleForTeachers[(int)at["id_teacher"]] = temp;
    }
    vector<json> temp = scheduleForAudiences[id_audience];
    temp.push_back({{"number_pair", number_pair},
                    {"day_week", day_week},
                    {"pair_type", pair_type},
                    {"id_audience", id_audience},
                    {"id_class", clas["id"]}});
    scheduleForAudiences[id_audience] = temp;
    schedule["scheduleForGroups"] = scheduleForGroups;
    schedule["scheduleForTeachers"] = scheduleForTeachers;
    schedule["scheduleForAudiences"] = scheduleForAudiences;
    return schedule;
}
