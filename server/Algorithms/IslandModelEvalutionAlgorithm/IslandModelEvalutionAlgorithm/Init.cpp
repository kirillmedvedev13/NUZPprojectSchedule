#include "EvalutionAlgorithm.h"

vector <individ> EvalutionAlgorithm::Init()
{
    populations = vector <individ>(population_size);
    // Заполнение базового расписания
    for (int k = 0; k < population_size; k++){
        for (auto & gr: bs.base_schedule_group){
            auto id = gr.first;
            auto &t = populations[k].scheduleForGroups.at(id);
            for (auto &sc : gr.second){
                t.push_back(&sc);
            }
        }
        for (auto & teach: bs.base_schedule_teacher){
            auto id = teach.first;
            auto &t = populations[k].scheduleForTeachers.at(id);
            for (auto &sc : teach.second){
                t.push_back(&sc);
            }
        }
        for (auto & aud: bs.base_schedule_audience){
            auto id = aud.first;
            auto &t = populations[k].scheduleForAudiences.at(id);
            for (auto &sc : aud.second){
                t.push_back(&sc);
            }
        }
    }
    // Расстановка расписания для кафедры
    // В начальном варианте у всех индиводов расписание разное но одинаковое количество пар
    for (size_t i = 0; i < classes.size(); i++){
        clas &clas = classes[i];
        vector<int> info = GetPairTypeForClass(clas);
        for (size_t j = 0; j < info.size(); j++)
        {
            for (int k = 0; k < population_size; k++){
                int day_week, number_pair;
                auto recommended_schedules = clas.recommended_schedules;

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

                int id_audience = GetIdAudienceForClass(clas);
                classes[i].schedules[k].push_back(schedule(number_pair,day_week,info[j],id_audience, clas.id));
            }
        }
    }
    // Расстановка ссылок на расписание
    for (int k = 0; k < population_size; k++){
        for (size_t i = 0; i < classes.size(); i++){
            clas &clas = classes[i];
            for (size_t j = 0; j < clas.schedules[k].size(); j++) {
                auto ref = &clas.schedules[k][j];
                for (auto gr : classes[i].assigned_groups){
                    auto &ref_gr = populations[k].scheduleForGroups[gr.id];
                    ref_gr.push_back(ref);
                }
                for (auto teach : classes[i].assigned_teachers){
                    auto &ref_teach = populations[k].scheduleForTeachers[teach.id];
                    ref_teach.push_back(ref);
                }
                auto &ref_aud = populations[k].scheduleForAudiences[clas.schedules[k][j].id_audience];
                ref_aud.push_back(ref);
            }
        }
    }
    return populations;
}
