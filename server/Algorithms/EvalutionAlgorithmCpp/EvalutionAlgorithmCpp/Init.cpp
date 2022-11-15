#include "json.hpp"
#include "Init.h"
#include <map>
#include <iostream>
#include "GetRndInteger.h"
#include "GetRndDouble.h"
#include "GetPairTypeForClass.h"
#include "GetIdAudienceForClass.h"
#include "AddClassToSchedule.h"
#include "TypeDefs.h"

vector <individ> Init(const vector <clas>& classes, const int& max_day,const int &population_size, const int& max_pair, const vector<audience>& audiences, const base_schedule  &bs)
{
    vector <individ> populations = vector <individ>(population_size);
        for (int j = 0; j < population_size; j++){
            AddClassToBaseSchedule(populations[j], bs);
        }
    for (int k = 0; k < population_size; k++){
		individ i_schedule= individ();
        for (size_t i = 0; i < classes.size(); i++){
            clas clas = classes[i];
            vector<int> info = GetPairTypeForClass(clas);
            for (size_t j = 0; j < info.size(); j++)
            {
                int day_week, number_pair;
                vector <recommended_schedule> recommended_schedules = clas.recommended_schedules;
            
                if (recommended_schedules.size())
                {
                    day_week = recommended_schedules[j].day_week;
                    number_pair = recommended_schedules[j].number_pair;
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
    }
    return populations;
}
