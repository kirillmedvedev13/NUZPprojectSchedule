#include "json.hpp"
#include "Init.h"
#include <map>
#include <iostream>
#include "GetRndInteger.h"
#include "GetRndDouble.h"
#include "GetPairTypeForClass.h"
#include "GetIdAudienceForClass.h"
#include "AddClassToSchedule.h"


individ Init(vector <clas> classes, int max_day, int max_pair, vector<audience> audiences, json base_schedule)
{

		individ i_schedule= individ();
        for (int j = 0; j < classes.size(); j++)
        {
            clas clas = classes[j];
            vector<int> info = GetPairTypeForClass(clas);
            for (int j = 0; j < info.size(); j++)
            {
                int day_week, number_pair;
                vector <recommended_schedule> recommeded_schedules = clas.recommended_schedules;
            
                if (recommeded_schedules.size())
                {
                    day_week = recommeded_schedules[j].day_week;
                    number_pair = recommeded_schedules[j].number_pair;
                }
                else
                {
                    day_week = GetRndInteger(1, max_day);
                    number_pair = GetRndInteger(1, max_pair);
                }
                int id_audience;

                id_audience = GetIdAudienceForClass(clas, audiences);


                    AddClassToSchedule(i_schedule, clas, day_week, number_pair, info[j], id_audience);

            }
        }
        if (!base_schedule.is_null())
        {
        }
        
        return i_schedule;
    
}
