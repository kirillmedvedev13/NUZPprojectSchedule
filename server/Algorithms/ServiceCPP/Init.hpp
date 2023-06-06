#ifndef INIT_HPP
#define INIT_HPP

#include "TypeDefs.hpp"
#include "GetPairTypeForClass.hpp"
#include "GetIdAudienceForClass.hpp"
#include "SetBaseScheduleToIndivid.hpp"

// Начальная инициализация расписания в classes
void InitClasses(string type_initialization, json data_SA, vector<individ> &populations, base_schedule &bs, vector<clas> &classes,
                 vector<audience> &audiences, int &max_day, int &max_pair){
    // Заполнение базового расписания
    for (size_t k = 0; k < populations.size(); k++)
    {
        SetBaseScheduleToIndivid(populations[k], bs);
    }
    // Расстановка расписания случайным образом
    if (type_initialization == "random") {
        // В начальном варианте у всех индиводов расписание разное
        for (size_t i = 0; i < classes.size(); i++) {
            auto &clas = classes[i];
            auto info = GetPairTypeForClass(clas);
            for (size_t k = 0; k < populations.size(); k++) {
                for (size_t j = 0; j < info.size(); j++) {
                    int day_week, number_pair;
                    //Растанока рекомендуемого расписания
                    auto recommended_schedules = clas.recommended_schedules;
                    if (j >= recommended_schedules.size()) {
                        day_week = GetRndInteger(1, max_day);
                        number_pair = GetRndInteger(1, max_pair);
                    }
                    else {
                        day_week = recommended_schedules[j].day_week;
                        number_pair = recommended_schedules[j].number_pair;
                    }
                    //Растановка аудитории
                    int id_audience = GetIdAudienceForClass(clas, audiences);
                    //Добавление пары в занятие
                    classes[i].schedules[k].push_back(schedule(number_pair, day_week, info[j], id_audience, clas.id));
                }
            }
        }
    }
    // Иначе расстановка расписания простым алгоритмом
    else if (type_initialization == "simple_algorithm"){
        for (auto &sc : data_SA["bestPopulation"]){
            int id_class = sc["id_class"];
            auto find_cl = find_if(classes.begin(), classes.end(), [&id_class](clas &cl){
                return cl.id == id_class;
            });
            for (size_t k = 0; k < populations.size(); k++) {
                find_cl->schedules[k].push_back(schedule(sc["number_pair"], sc["day_week"], sc["pair_type"], sc["id_audience"], id_class));
            }
        }
    }
}

void InitPopulations(vector<individ> &populations, vector<clas> &classes)
{
    // Расстановка ссылок на расписание для индивидов
    for (size_t index_individ = 0; index_individ < populations.size(); index_individ++) {
        for (size_t index_class = 0; index_class < classes.size(); index_class++) {
            clas &clas = classes[index_class];
            for (size_t index_pair = 0; index_pair < clas.schedules[index_individ].size(); index_pair++) {
                auto ref = &clas.schedules[index_individ][index_pair];
                // Добавление ссылки на занятие для груп
                for (auto &gr : classes[index_class].assigned_groups)
                {
                    auto &ref_gr = populations[index_individ].scheduleForGroups[gr.id];
                    ref_gr.push_back(ref);
                }
                // Добавление ссылки на занятие для учителей
                for (auto &teach : classes[index_class].assigned_teachers)
                {
                    auto &ref_teach = populations[index_individ].scheduleForTeachers[teach.id];
                    ref_teach.push_back(ref);
                }
                // Добавление ссылки на занятие для аудитории
                auto &ref_aud = populations[index_individ].scheduleForAudiences[clas.schedules[index_individ][index_pair].id_audience];
                ref_aud.push_back(ref);
            }
        }
    }
}

#endif // INIT_H
