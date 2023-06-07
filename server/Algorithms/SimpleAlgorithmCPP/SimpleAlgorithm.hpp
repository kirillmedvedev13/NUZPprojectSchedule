#ifndef SIMPLEALGORITHM_HPP
#define SIMPLEALGORITHM_HPP

#include "../ServiceCPP/Service.hpp"

#include <climits>
#include <set>
#include <cfloat>

struct Clas{
    int day_week;
    int pair_type;
    int number_pair;
    Clas(int day_week, int number_pair, int pair_type){
        this->day_week = day_week;
        this->number_pair = number_pair;
        this->pair_type = pair_type;
    }
    Clas operator=(const Clas &b){
        return Clas(b.day_week, b.number_pair, b.pair_type);
    }
    bool operator==(const Clas &b) const{
        if (this->day_week == b.day_week && this->pair_type == b.pair_type && this->number_pair == b.number_pair)
            return true;
        return false;
    }
    bool operator<(const Clas &b) const{
        if (this->day_week < b.day_week)
            return true;
        if (this->day_week > b.day_week)
            return false;
        if (this->number_pair < b.number_pair)
            return true;
        if (this->number_pair > b.number_pair)
            return false;
        if (this->pair_type < b.pair_type)
            return true;
        if (this->pair_type > b.pair_type)
            return false;
        return false;
    }
};


class SimpleAlgorithm : public Service
{
public:
    SimpleAlgorithm(json data){
        InitService(data, 1);
        auto &ind = populations[0];
        for (auto &cl : classes){
            auto info = GetPairTypeForClass(cl);
            cl.schedules[0] = vector<schedule>(info.size());
            for (size_t j = 0; j < info.size(); j++) {
                int _DAY_WEEK, _NUMBER_PAIR, _PAIR_TYPE, _ID_AUDIENCE;
                // Пройтись так же по рекомендуемым аудитории, если они есть
                auto vec_audience = vector<ContainId>();
                if (cl.recommended_audiences.size() > 0){
                    for (auto &aud : cl.recommended_audiences){
                        vec_audience.push_back(aud);
                    }
                }
                else{
                    vec_audience.push_back(ContainId(GetIdAudienceForClass(cl, audiences)));
                }
                // Если есть рекомендуемое время, то сразу его поставить
                if (j < cl.recommended_schedules.size()) {
                    _DAY_WEEK = cl.recommended_schedules[j].day_week;
                    _NUMBER_PAIR = cl.recommended_schedules[j].number_pair;
                    _PAIR_TYPE = info[j];
                    _ID_AUDIENCE = vec_audience[GetRndInteger(0, vec_audience.size() -1)].id;
                }
                // Если рекомендуемого времени нету, то начать поиск свободной пары
                else {
                    auto INTERSECTION_GROUPS = vector<Clas>();
                    auto INTERSECTION_TEACHERS = vector<Clas>();

                    auto arr_group = vector<vector<Clas>>();
                    for (auto &gr : cl.assigned_groups){
                        // Создание вектора если он не создан
                        auto res_map = ind.scheduleForGroups.find(gr.id);
                        if (res_map == ind.scheduleForGroups.end()){
                            ind.scheduleForGroups.insert(make_pair(gr.id, vector<schedule *>()));
                        }
                        auto &ref = ind.scheduleForGroups[gr.id];
                        // сортировка расписания
                        sort(ref.begin(), ref.end(), CompareSchedule);
                        auto temp_set_no_overlay = vector<Clas>();
                        auto temp_set_no_window = vector<Clas>();
                        // Нужно добавить в сет все свободные пары
                        auto startFitnessWindows = FitnessWindows(ref, penaltyGrWin);
                        auto startFitnessSameTimes = FitnessSameTimes(ref);
                        for (int day_week = 1; day_week <= max_day; day_week++){
                            for (int number_pair = 1; number_pair <= max_pair; number_pair++){
                                for (int pair_type = 1; pair_type <= 3; pair_type++){
                                    auto sc = schedule(number_pair, day_week, pair_type, -1, cl.id);
                                    ref.push_back(&sc);
                                    sort(ref.begin(), ref.end(), CompareSchedule);
                                    auto tempFitnessWindows = FitnessWindows(ref, penaltyGrWin);
                                    auto tempFitnessSameTimes = FitnessSameTimes(ref);
                                    // Если такая пара подходит по окнам
                                    if (tempFitnessWindows - startFitnessWindows == 0){
                                        temp_set_no_window.push_back(Clas(day_week, number_pair, pair_type));
                                    }
                                    // Если такая пара подходит по накладкам
                                    if (tempFitnessSameTimes - startFitnessSameTimes == 0){
                                        temp_set_no_overlay.push_back(Clas(day_week, number_pair, pair_type));
                                    }
                                    ref.erase(find(ref.begin(), ref.end(), &sc));
                                }
                            }
                        }
                        auto temp = vector<Clas>();
                        set_intersection(temp_set_no_overlay.begin(), temp_set_no_overlay.end(), temp_set_no_window.begin(), temp_set_no_window.end(), back_inserter(temp));
                        arr_group.push_back(temp);

                    }
                    // Если только одна группа
                    if (arr_group.size() == 1){
                        for (auto &cl : arr_group[0]){
                            INTERSECTION_GROUPS.push_back(cl);
                        }
                    }else if (arr_group.size() > 1){
                        auto temp_arr = vector<vector<Clas>>(arr_group.size() - 1);
                        // Выбор свободных пар среди всех групп у занятия
                        for (size_t i = 0; i < arr_group.size() - 1; i++){
                            if (i != 0){
                                set_intersection(temp_arr[i-1].begin(), temp_arr[i-1].end(), arr_group[i+1].begin(), arr_group[i+1].end(), back_inserter(temp_arr[i]));
                            }
                            else
                                set_intersection(arr_group[i].begin(), arr_group[i].end(), arr_group[i+1].begin(), arr_group[i+1].end(), back_inserter(temp_arr[i]));
                        }
                        for (auto &cl : temp_arr[temp_arr.size() - 1]){
                            INTERSECTION_GROUPS.push_back(cl);
                        }
                    }

                    auto arr_teacher = vector<vector<Clas>>();
                    for (auto &teacher : cl.assigned_teachers){
                        // Создание вектора если он не создан
                        auto res_map = ind.scheduleForTeachers.find(teacher.id);
                        if (res_map == ind.scheduleForTeachers.end()){
                            ind.scheduleForTeachers.insert(make_pair(teacher.id, vector<schedule *>()));
                        }
                        auto &ref = ind.scheduleForTeachers[teacher.id];
                        // сортировка расписания
                        sort(ref.begin(), ref.end(), CompareSchedule);
                        auto temp_set_no_overlay = vector<Clas>();
                        auto temp_set_no_window = vector<Clas>();
                        // Нужно добавить в сет все свободные пары
                        auto startFitnessWindows = FitnessWindows(ref, penaltyTeachWin);
                        auto startFitnessSameTimes = FitnessSameTimes(ref);
                        for (int day_week = 1; day_week <= max_day; day_week++){
                            for (int number_pair = 1; number_pair <= max_pair; number_pair++){
                                for (int pair_type = 1; pair_type <= 3; pair_type++){
                                    auto sc = schedule(number_pair, day_week, pair_type, -1, cl.id);
                                    ref.push_back(&sc);
                                    sort(ref.begin(), ref.end(), CompareSchedule);
                                    auto tempFitnessWindows = FitnessWindows(ref, penaltyTeachWin);
                                    auto tempFitnessSameTimes = FitnessSameTimes(ref);
                                    // Если такая пара подходит по окнам
                                    if (tempFitnessWindows - startFitnessWindows == 0){
                                        temp_set_no_window.push_back(Clas(day_week, number_pair, pair_type));
                                    }
                                    // Если такая пара подходит по накладкам
                                    if (tempFitnessSameTimes - startFitnessSameTimes == 0){
                                        temp_set_no_overlay.push_back(Clas(day_week, number_pair, pair_type));
                                    }
                                    ref.erase(find(ref.begin(), ref.end(), &sc));
                                }
                            }
                        }
                        auto temp = vector<Clas>();
                        set_intersection(temp_set_no_overlay.begin(), temp_set_no_overlay.end(), temp_set_no_window.begin(), temp_set_no_window.end(), back_inserter(temp));
                        arr_teacher.push_back(temp);

                    }
                    // Если только один учитель
                    if (arr_teacher.size() == 1){
                        for (auto &cl : arr_teacher[0]){
                            INTERSECTION_TEACHERS.push_back(cl);
                        }
                    }else if (arr_teacher.size() > 1){
                        auto temp_arr = vector<vector<Clas>>(arr_teacher.size() - 1);
                        // Выбор свободных пар среди всех групп у занятия
                        for (size_t i = 0; i < arr_teacher.size() - 1; i++){
                            if (i != 0){
                                set_intersection(temp_arr[i-1].begin(), temp_arr[i-1].end(), arr_teacher[i+1].begin(), arr_teacher[i+1].end(), back_inserter(temp_arr[i]));
                            }
                            else
                                set_intersection(arr_teacher[i].begin(), arr_teacher[i].end(), arr_teacher[i+1].begin(), arr_teacher[i+1].end(), back_inserter(temp_arr[i]));
                        }
                        for (auto &cl : temp_arr[temp_arr.size() - 1]){
                            INTERSECTION_TEACHERS.push_back(cl);
                        }
                    }

                    auto arr_audience = vector<vector<Clas>>();
                    for (auto &aud : vec_audience){
                        // Создание вектора если он не создан
                        auto res_map = ind.scheduleForAudiences.find(aud.id);
                        if (res_map == ind.scheduleForAudiences.end()){
                            ind.scheduleForAudiences.insert(make_pair(aud.id, vector<schedule *>()));
                        }
                        auto &ref = ind.scheduleForAudiences[aud.id];
                        // сортировка расписания
                        sort(ref.begin(), ref.end(), CompareSchedule);
                        auto temp_set_no_overlay = vector<Clas>();
                        // Нужно добавить в сет все свободные пары
                        auto startFitnessSameTimes = FitnessSameTimes(ref);
                        for (int day_week = 1; day_week <= max_day; day_week++){
                            for (int number_pair = 1; number_pair <= max_pair; number_pair++){
                                for (int pair_type = 1; pair_type <= 3; pair_type++){
                                    auto sc = schedule(number_pair, day_week, pair_type, aud.id, cl.id);
                                    ref.push_back(&sc);
                                    sort(ref.begin(), ref.end(), CompareSchedule);
                                    auto tempFitnessSameTimes = FitnessSameTimes(ref);
                                    // Если такая пара подходит по накладкам
                                    if (tempFitnessSameTimes - startFitnessSameTimes == 0){
                                        temp_set_no_overlay.push_back(Clas(day_week, number_pair, pair_type));
                                    }
                                    ref.erase(find(ref.begin(), ref.end(), &sc));
                                }
                            }
                        }
                        arr_audience.push_back(temp_set_no_overlay);
                    }

                    auto INTERSECTION = vector<Clas>();
                    auto INTERSECTION_TEACHER_GROUP = vector<Clas>();
                    auto temp_intersection  = vector<Clas>();
                    set_intersection(INTERSECTION_GROUPS.begin(), INTERSECTION_GROUPS.end(), INTERSECTION_TEACHERS.begin(), INTERSECTION_TEACHERS.end(),
                                     back_inserter(temp_intersection));
                    // Фильтрация пар по нужному типу
                    if (info[j] == 1 || info[j] == 2){
                        copy_if(temp_intersection.begin(), temp_intersection.end(), back_inserter(INTERSECTION_TEACHER_GROUP), [](Clas &i){
                            return i.pair_type == 1 || i.pair_type == 2;
                        });
                    }
                    else if(info[j] == 3){
                        copy_if(temp_intersection.begin(), temp_intersection.end(), back_inserter(INTERSECTION_TEACHER_GROUP), [](Clas &i){
                            return i.pair_type == 3;
                        });
                    }
                    // Пройтись по каждой аудитории и найти ту, в которой больше свободных пар
                    int index_best_aud = -1;
                    int count_pair_best_aud = INT_MIN;
                    auto temp_arr = vector<vector<Clas>>(arr_audience.size());
                    for(size_t i = 0; i < arr_audience.size(); i ++){
                        auto temp = vector<Clas>();
                        set_intersection(INTERSECTION_TEACHER_GROUP.begin(), INTERSECTION_TEACHER_GROUP.end(), arr_audience[i].begin(), arr_audience[i].end(), back_inserter(temp));
                        temp_arr[i] = temp;
                        if ((int)temp.size() > count_pair_best_aud){
                            index_best_aud = i;
                            count_pair_best_aud = temp_arr[i].size();
                        }
                    }
                    _ID_AUDIENCE = vec_audience[index_best_aud].id;
                    for (auto &cl : temp_arr[index_best_aud]){
                        INTERSECTION.push_back(cl);
                    }

                    // Если вообще не нашло подходящего времени, то выбрать лучшее расположение занятия
                    if(INTERSECTION.size() == 0){
                        double best_fitness = DBL_MAX;
                        schedule best_sc;
                        for(int day_week = 1; day_week <= max_day; day_week++){
                            for(int number_pair = 1; number_pair <= max_pair; number_pair++){
                                int pair_type, finish;
                                if (info[j] == 1 || info[j] == 2){
                                    pair_type = 1;
                                    finish = 2;
                                }
                                else{
                                    pair_type = 3;
                                    finish = 3;
                                }
                                for (; pair_type <= finish; pair_type++){
                                    // Так же пройтись по аудиториям для лучшего распределения
                                    for (auto &aud : vec_audience){
                                        auto sc = schedule(number_pair, day_week, pair_type, aud.id, cl.id);
                                        // Добавление расписания ко всем
                                        for (auto &gr : cl.assigned_groups){
                                            auto &ref_gr = ind.scheduleForGroups[gr.id];
                                            ref_gr.push_back(&sc);
                                        }
                                        for (auto &teacher : cl.assigned_teachers){
                                            auto &ref_teach = ind.scheduleForTeachers[teacher.id];
                                            ref_teach.push_back(&sc);
                                        }
                                        auto &ref_aud = ind.scheduleForAudiences[aud.id];
                                        ref_aud.push_back(&sc);

                                        Fitness(0);
                                        auto tempFitness = ind.fitnessValue.fitnessValue;
                                        if (tempFitness < best_fitness){
                                            best_fitness = tempFitness;
                                            best_sc = schedule(number_pair, day_week, pair_type, aud.id, cl.id);
                                        }

                                        // Удаление расписания у всех
                                        for (auto &gr : cl.assigned_groups){
                                            auto &ref_gr = ind.scheduleForGroups[gr.id];
                                            ref_gr.erase(find(ref_gr.begin(), ref_gr.end(), &sc));
                                        }
                                        for (auto &teacher : cl.assigned_teachers){
                                            auto &ref_teach = ind.scheduleForTeachers[teacher.id];
                                            ref_teach.erase(find(ref_teach.begin(), ref_teach.end(), &sc));
                                        }
                                        ref_aud.erase(find(ref_aud.begin(), ref_aud.end(), &sc));
                                    }
                                }
                            }
                        }
                        _DAY_WEEK = best_sc.day_week;
                        _NUMBER_PAIR = best_sc.number_pair;
                        _PAIR_TYPE = best_sc.pair_type;
                        _ID_AUDIENCE = best_sc.id_audience;
                    }
                    // Если найдены подходящие времена занятий, то выбрать случайное из них
                    else{
                        int r = GetRndInteger(0, INTERSECTION.size() - 1);
                        _DAY_WEEK = INTERSECTION[r].day_week;
                        _NUMBER_PAIR = INTERSECTION[r].number_pair;
                        _PAIR_TYPE = INTERSECTION[r].pair_type;
                    }
                }
                auto sc = schedule(_NUMBER_PAIR, _DAY_WEEK, _PAIR_TYPE, _ID_AUDIENCE, cl.id);
                cl.schedules[0][j] = sc;
                auto ref = &cl.schedules[0][j];
                // Добавление ссылки на занятие для груп
                for (auto &gr : cl.assigned_groups)
                {
                    auto &ref_gr = ind.scheduleForGroups[gr.id];
                    ref_gr.push_back(ref);
                }
                // Добавление ссылки на занятие для учителей
                for (auto &teach : cl.assigned_teachers)
                {
                    auto &ref_teach = ind.scheduleForTeachers[teach.id];
                    ref_teach.push_back(ref);
                }
                // Добавление ссылки на занятие для аудитории
                auto &ref_aud = ind.scheduleForAudiences[_ID_AUDIENCE];
                ref_aud.push_back(ref);
            }
        }
    }
};
#endif // SIMPLEALGORITHM_H
