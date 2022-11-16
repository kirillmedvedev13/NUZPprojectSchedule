#ifndef INITINDIVID_H
#define INITINDIVID_H

#include <TypeDefs.h>

using namespace std;

void InitIndivid(individ &ind, vector<clas> & classes, int old_index, int new_index, vector<vector<vector<schedule>>> &temp_schedules, base_schedule  &bs){
    for (size_t i = 0; i < classes.size(); i++){
        for (size_t j = 0; j < temp_schedules[i][old_index].size(); j++){
            classes[i].schedules[new_index].clear();
            classes[i].schedules[new_index].push_back(temp_schedules[i][old_index][j]);
            auto ref = &classes[i].schedules[new_index][j];
            for (auto gr : classes[i].assigned_groups){
                auto &ref_gr = ind.scheduleForGroups.at(gr.id);
                ref_gr.push_back(ref);
            }
            for (auto teach : classes[i].assigned_teachers){
                auto &ref_teach = ind.scheduleForTeachers.at(teach.id);
                ref_teach.push_back(ref);
            }
            auto &ref_aud = ind.scheduleForAudiences.at(ref->id_audience);
            ref_aud.push_back(ref);
        }
    }

    for (auto & gr: bs.base_schedule_group){
        auto id = gr.first;
        auto &t = ind.scheduleForGroups.at(id);
        for (auto &sc : gr.second){
            t.push_back(&sc);
        }
    }
    for (auto & teach: bs.base_schedule_teacher){
        auto id = teach.first;
        auto &t = ind.scheduleForTeachers.at(id);
        for (auto &sc : teach.second){
            t.push_back(&sc);
        }
    }
    for (auto & aud: bs.base_schedule_audience){
        auto id = aud.first;
        auto &t = ind.scheduleForAudiences.at(id);
        for (auto &sc : aud.second){
            t.push_back(&sc);
        }
    }
}

#endif // INITINDIVID_H
