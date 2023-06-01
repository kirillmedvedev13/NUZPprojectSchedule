#ifndef SETBASESCHEDULETOINDIVID_HPP
#define SETBASESCHEDULETOINDIVID_HPP

#include "TypeDefs.hpp"

// Установка базового расписания для индивида
void SetBaseScheduleToIndivid(individ &ind, base_schedule &bs){
    for (auto &gr : bs.base_schedule_group)
    {
        auto id = gr.first;
        auto &t = ind.scheduleForGroups.at(id);
        for (auto &sc : gr.second)
        {
            t.push_back(&sc);
        }
    }
    for (auto &teach : bs.base_schedule_teacher)
    {
        auto id = teach.first;
        auto &t = ind.scheduleForTeachers.at(id);
        for (auto &sc : teach.second)
        {
            t.push_back(&sc);
        }
    }
    for (auto &aud : bs.base_schedule_audience)
    {
        auto id = aud.first;
        auto &t = ind.scheduleForAudiences.at(id);
        for (auto &sc : aud.second)
        {
            t.push_back(&sc);
        }
    }
}
#endif // SETBASESCHEDULETOINDIVID_H
