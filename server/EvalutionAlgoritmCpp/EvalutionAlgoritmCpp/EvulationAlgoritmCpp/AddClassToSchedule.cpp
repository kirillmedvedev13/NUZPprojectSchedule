#include "AddClassToSchedule.h"
#include <iostream>

void AddClassToSchedule(individ& i_schedule, clas clas, int day_week, int number_pair, int pair_type, int id_audience)
{
    for (assigned_group ag : clas.assigned_groups)
    {
        vector<schedule> temp = i_schedule.scheduleForGroups[ag.id_group];

        temp.push_back(schedule(0, number_pair, day_week, pair_type, ag.id, id_audience, clas.id));

        i_schedule.scheduleForGroups[ag.id_group] = temp;
    }
    for (assigned_teacher at : clas.assigned_teachers)
    {
        vector<schedule> temp = i_schedule.scheduleForTeachers[at.id_teacher];

        temp.push_back(schedule(0, number_pair, day_week, pair_type, -1, id_audience, clas.id));

        i_schedule.scheduleForTeachers[at.id_teacher] = temp;
    }
    vector<schedule> temp = i_schedule.scheduleForAudiences[id_audience];
    temp.push_back(schedule(0, number_pair, day_week, pair_type, -1, id_audience, clas.id));
    i_schedule.scheduleForAudiences[id_audience] = temp;   
}
