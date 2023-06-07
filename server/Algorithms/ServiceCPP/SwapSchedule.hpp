#ifndef SWAPSCHEDULE_HPP
#define SWAPSCHEDULE_HPP

#include "TypeDefs.hpp"

//Замена одной пары у занятия на переданное
void SwapSchedule(individ &_individ, schedule *ref, schedule sc){
    int old_id_audience = ref->id_audience;
    int new_id_audience = sc.id_audience;
    // Если ид аудитории поменялся, то нужно поменять указатель на неё
    if (new_id_audience != old_id_audience)
    {
        auto it = find(_individ.scheduleForAudiences[old_id_audience].begin(), _individ.scheduleForAudiences[old_id_audience].end(), ref);
        _individ.scheduleForAudiences[old_id_audience].erase(it);
        _individ.scheduleForAudiences[new_id_audience].push_back(ref);
    }
    // Поменять значение пары у занятия
    *ref = sc;
}

//Полная замена пар из занятия на переданные
void SwapSchedule(clas &_cl, int &index_individ, individ &_individ, vector<schedule> &new_schedules){
    // Сперва нужно пройтись по всем и поудалять указатели на пары
    for (auto &ref_pair: _cl.schedules[index_individ]){
        auto pointer_pair = &ref_pair;
        auto it = find(_individ.scheduleForAudiences[ref_pair.id_audience].begin(), _individ.scheduleForAudiences[ref_pair.id_audience].end(), pointer_pair);
        _individ.scheduleForAudiences[ref_pair.id_audience].erase(it);
        for (auto &gr: _cl.assigned_groups){
            it = find(_individ.scheduleForGroups[gr.id].begin(), _individ.scheduleForGroups[gr.id].end(), pointer_pair);
            _individ.scheduleForGroups[gr.id].erase(it);
        }
        for (auto &teach: _cl.assigned_teachers){
            it = find(_individ.scheduleForTeachers[teach.id].begin(), _individ.scheduleForTeachers[teach.id].end(), pointer_pair);
            _individ.scheduleForTeachers[teach.id].erase(it);
        }

    }
    _cl.schedules[index_individ].resize(new_schedules.size());
    // Затем заново расставить ссылки у всех
    for (size_t i = 0; i < new_schedules.size(); i++){
        _cl.schedules[index_individ][i] = new_schedules[i];
        auto pointer_pair = &_cl.schedules[index_individ][i];
        _individ.scheduleForAudiences[pointer_pair->id_audience].push_back(pointer_pair);
        for (auto &gr: _cl.assigned_groups){
            _individ.scheduleForGroups[gr.id].push_back(pointer_pair);
        }
        for (auto &teach: _cl.assigned_teachers){
            _individ.scheduleForTeachers[teach.id].push_back(pointer_pair);
        }
    }
}

//Обмен занятий между индивидами
void SwapSchedule(clas &_cl, int &index_individ_1, individ &_individ1, int &index_individ_2, individ &_individ2){
    // Сначало нужно сохранить вектор пар у первого индивида
    auto temp_schedule1 = _cl.schedules[index_individ_1];
    // Затем нужно пройтись по всем и поудалять указатели на пары у первого индивида
    for (auto &ref_pair: _cl.schedules[index_individ_1]){
        auto pointer_pair = &ref_pair;
        auto it = find(_individ1.scheduleForAudiences[ref_pair.id_audience].begin(), _individ1.scheduleForAudiences[ref_pair.id_audience].end(), pointer_pair);
        _individ1.scheduleForAudiences[ref_pair.id_audience].erase(it);
        for (auto &gr: _cl.assigned_groups){
            it = find(_individ1.scheduleForGroups[gr.id].begin(), _individ1.scheduleForGroups[gr.id].end(), pointer_pair);
            _individ1.scheduleForGroups[gr.id].erase(it);
        }
        for (auto &teach: _cl.assigned_teachers){
            it = find(_individ1.scheduleForTeachers[teach.id].begin(), _individ1.scheduleForTeachers[teach.id].end(), pointer_pair);
            _individ1.scheduleForTeachers[teach.id].erase(it);
        }

    }
    _cl.schedules[index_individ_1].resize(_cl.schedules[index_individ_2].size());
    // Затем заново расставить ссылки у всех у первого индивида
    for (size_t i = 0; i < _cl.schedules[index_individ_2].size(); i++){
        _cl.schedules[index_individ_1][i] = _cl.schedules[index_individ_2][i];
        auto pointer_pair = &_cl.schedules[index_individ_1][i];
        _individ1.scheduleForAudiences[pointer_pair->id_audience].push_back(pointer_pair);
        for (auto &gr: _cl.assigned_groups){
            _individ1.scheduleForGroups[gr.id].push_back(pointer_pair);
        }
        for (auto &teach: _cl.assigned_teachers){
            _individ1.scheduleForTeachers[teach.id].push_back(pointer_pair);
        }
    }
    // Затем нужно пройтись по всем и поудалять указатели на пары у второго индивида
    for (auto &ref_pair: _cl.schedules[index_individ_2]){
        auto pointer_pair = &ref_pair;
        auto it = find(_individ2.scheduleForAudiences[ref_pair.id_audience].begin(), _individ2.scheduleForAudiences[ref_pair.id_audience].end(), pointer_pair);
        _individ2.scheduleForAudiences[ref_pair.id_audience].erase(it);
        for (auto &gr: _cl.assigned_groups){
            it = find(_individ2.scheduleForGroups[gr.id].begin(), _individ2.scheduleForGroups[gr.id].end(), pointer_pair);
            _individ2.scheduleForGroups[gr.id].erase(it);
        }
        for (auto &teach: _cl.assigned_teachers){
            it = find(_individ2.scheduleForTeachers[teach.id].begin(), _individ2.scheduleForTeachers[teach.id].end(), pointer_pair);
            _individ2.scheduleForTeachers[teach.id].erase(it);
        }

    }
    _cl.schedules[index_individ_2].resize(temp_schedule1.size());
    // Затем заново расставить ссылки у всех у второго индивида
    for (size_t i = 0; i < temp_schedule1.size(); i++){
        _cl.schedules[index_individ_2][i] = temp_schedule1[i];
        auto pointer_pair = &_cl.schedules[index_individ_2][i];
        _individ2.scheduleForAudiences[pointer_pair->id_audience].push_back(pointer_pair);
        for (auto &gr: _cl.assigned_groups){
            _individ2.scheduleForGroups[gr.id].push_back(pointer_pair);
        }
        for (auto &teach: _cl.assigned_teachers){
            _individ2.scheduleForTeachers[teach.id].push_back(pointer_pair);
        }
    }
}

#endif // SWAPSCHEDULE_H
