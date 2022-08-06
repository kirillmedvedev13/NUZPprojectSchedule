#include "json.hpp"
#include <vector>
#include <map>
#include <iostream>
#include "GetRndInteger.h"
#include "GetRndDouble.h"
#include "GetPairTypeForClass.h"
#include "GetIdAudienceForClass.h"
#include "AddClassToSchedule.h"

using namespace std;
using namespace nlohmann;

void Init(json &populations,json classes, int population_size, int max_day, int max_pair, json audiences, json base_schedule)
{

    populations = json::array();
    for (int i = 0; i < population_size; i++)
    {
        map<int, vector<json>> scheduleForGroups, scheduleForTeachers, scheduleForAudiences;
        json schedule = {
            {"scheduleForGroups", scheduleForGroups},
            {"scheduleForTeachers", scheduleForTeachers},
            {"scheduleForAudiences", scheduleForAudiences},
            {"fitnessValue", NULL}};

        for (int j = 0; j < (int)classes.size(); j++)
        {

            cout<<j<<endl;
            json clas= classes[j];
            vector<int> info = GetPairTypeForClass(clas);
            for (int j = 0; j < (int)info.size(); j++)
            {
                int day_week, number_pair;
                json rec_sched_j = clas["recommeded_schedules"][j];
                if (!rec_sched_j.is_null())
                {
                    day_week = rec_sched_j["day_week"];
                    number_pair = rec_sched_j["number_pair"];
                }
                else
                {
                    day_week = GetRndInteger(1, max_day);
                    number_pair = GetRndInteger(1, max_pair);
                }
                int id_audience;

                id_audience = GetIdAudienceForClass(clas, audiences);


                    AddClassToSchedule(schedule, clas, day_week, number_pair, info[j], id_audience);

            }
        }
        if (!base_schedule.is_null())
        {
        }
        if(schedule.is_null()){
            cout<<endl;
        }
        populations.push_back(schedule);
    }
    // std::cout<<setw(4)<<populations[0]<<std::endl;
}
