#include "../ServiceCPP/json.hpp"
#include "../ServiceCPP/Service.hpp"
#include "../ServiceCPP/TypeDefs.hpp"
#include "../ServiceCPP/SetBaseScheduleToIndivid.hpp"
#include "../ServiceCPP/GetPairTypeForClass.hpp"
#include "../ServiceCPP/GetIdAudienceForClass.hpp"
#include "../ServiceCPP/Fitness.hpp"

#include <iostream>
#include <filesystem>
#include <fstream>
#include <chrono>
#include <climits>
#include <set>
#include <cfloat>

using namespace std;
using namespace nlohmann;

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


int main(int argc,char* argv[])
{
    try
    {
        auto StartTime = chrono::high_resolution_clock::now();
        string path;
        if (argc == 2){
            path = argv[1];
        }
        else {
            path = filesystem::current_path().string();
        }
        json data = json();
        ifstream fileData(path + "\\data.json");
        data = json::parse(fileData);
        auto bs = base_schedule(data["base_schedule"]["schedule_group"], data["base_schedule"]["schedule_teacher"], data["base_schedule"]["schedule_audience"]);

        // Значение фитнесса и время
        auto result = vector<pair<int, double>>();

        const json general_values = data["general_values"];
        double penaltySameRecSc = general_values["penaltySameRecSc"];
        double penaltyGrWin = general_values["penaltyGrWin"];
        double penaltyTeachWin = general_values["penaltyTeachWin"];
        double penaltySameTimesSc = general_values["penaltySameTimesSc"];

        int max_day = data["max_day"];
        int max_pair = data["max_pair"];

        //Добавление занятий
        auto classes = vector<clas>();
        for (json &cl : data["classes"])
        {
            classes.push_back(clas(cl, 1));
        }

        //Добавление аудиторий
        auto audiences = vector<audience>();
        for (json &aud : data["audiences"])
        {
            audience new_aud(aud);
            audiences.push_back(new_aud);
        }

        auto ind = individ();
        SetBaseScheduleToIndivid(ind, bs);

        for (auto &cl : classes){
            auto info = GetPairTypeForClass(cl);
            cl.schedules[0] = vector<schedule>(info.size());
            for (size_t j = 0; j < info.size(); j++) {
                int DAY_WEEK, NUMBER_PAIR, PAIR_TYPE;
                int id_audience = GetIdAudienceForClass(cl, audiences);
                // Если есть рекомендуемое время, то сразу его поставить
                if (j < cl.recommended_schedules.size()) {
                    DAY_WEEK = cl.recommended_schedules[j].day_week;
                    NUMBER_PAIR = cl.recommended_schedules[j].number_pair;
                    PAIR_TYPE = info[j];
                }
                // Если рекомендуемого времени нету, то начать поиск свободной пары
                else {
                    auto INTERSECTION_GROUPS = vector<Clas>();
                    auto INTERSECTION_TEACHERS = vector<Clas>();
                    auto INTERSECTION_AUDIENCES = vector<Clas>();

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
                        auto startFitnessWindows = FitnessWindows(ref, penaltyGrWin, max_day);
                        auto startFitnessSameTimes = FitnessSameTimes(ref, penaltySameTimesSc);
                        for (int day_week = 1; day_week <= max_day; day_week++){
                            for (int number_pair = 1; number_pair <= max_pair; number_pair++){
                                for (int pair_type = 1; pair_type <= 3; pair_type++){
                                    auto sc = schedule(number_pair, day_week, pair_type, id_audience, cl.id);
                                    ref.push_back(&sc);
                                    sort(ref.begin(), ref.end(), CompareSchedule);
                                    auto tempFitnessWindows = FitnessWindows(ref, penaltyGrWin, max_day);
                                    auto tempFitnessSameTimes = FitnessSameTimes(ref, penaltySameTimesSc);
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
                        auto startFitnessWindows = FitnessWindows(ref, penaltyTeachWin, max_day);
                        auto startFitnessSameTimes = FitnessSameTimes(ref, penaltySameTimesSc);
                        for (int day_week = 1; day_week <= max_day; day_week++){
                            for (int number_pair = 1; number_pair <= max_pair; number_pair++){
                                for (int pair_type = 1; pair_type <= 3; pair_type++){
                                    auto sc = schedule(number_pair, day_week, pair_type, id_audience, cl.id);
                                    ref.push_back(&sc);
                                    sort(ref.begin(), ref.end(), CompareSchedule);
                                    auto tempFitnessWindows = FitnessWindows(ref, penaltyTeachWin, max_day);
                                    auto tempFitnessSameTimes = FitnessSameTimes(ref, penaltySameTimesSc);
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
                    // Если только одна группа
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

                    // Создание вектора если он не создан
                    auto res_map = ind.scheduleForAudiences.find(id_audience);
                    if (res_map == ind.scheduleForAudiences.end()){
                        ind.scheduleForAudiences.insert(make_pair(id_audience, vector<schedule *>()));
                    }
                    auto &ref = ind.scheduleForAudiences[id_audience];
                    // сортировка расписания
                    sort(ref.begin(), ref.end(), CompareSchedule);
                    auto temp_set_no_overlay = vector<Clas>();
                    // Нужно добавить в сет все свободные пары
                    auto startFitnessSameTimes = FitnessSameTimes(ref, penaltySameTimesSc);
                    for (int day_week = 1; day_week <= max_day; day_week++){
                        for (int number_pair = 1; number_pair <= max_pair; number_pair++){
                            for (int pair_type = 1; pair_type <= 3; pair_type++){
                                auto sc = schedule(number_pair, day_week, pair_type, id_audience, cl.id);
                                ref.push_back(&sc);
                                sort(ref.begin(), ref.end(), CompareSchedule);
                                auto tempFitnessSameTimes = FitnessSameTimes(ref, penaltySameTimesSc);
                                // Если такая пара подходит по накладкам
                                if (tempFitnessSameTimes - startFitnessSameTimes == 0){
                                    INTERSECTION_AUDIENCES.push_back(Clas(day_week, number_pair, pair_type));
                                }
                                ref.erase(find(ref.begin(), ref.end(), &sc));
                            }
                        }
                    }

                    auto INTERSECTION = vector<Clas>();
                    auto tempInter = vector<Clas>();
                    auto tempInter2 = vector<Clas>();
                    set_intersection(INTERSECTION_GROUPS.begin(), INTERSECTION_GROUPS.end(), INTERSECTION_TEACHERS.begin(), INTERSECTION_TEACHERS.end(), back_inserter(tempInter));
                    set_intersection(tempInter.begin(), tempInter.end(), INTERSECTION_AUDIENCES.begin(), INTERSECTION_AUDIENCES.end(), back_inserter(tempInter2));
                    // Фильтрация пар по нужному типу
                    if (info[j] == 1 || info[j] == 2){
                        copy_if(tempInter2.begin(), tempInter2.end(), back_inserter(INTERSECTION), [](Clas &i){
                            return i.pair_type == 1 || i.pair_type == 2;
                        });
                    }
                    else if(info[j] == 3){
                        copy_if(tempInter2.begin(), tempInter2.end(), back_inserter(INTERSECTION), [](Clas &i){
                            return i.pair_type == 3;
                        });
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
                                    auto sc = schedule(number_pair, day_week, pair_type, id_audience, cl.id);
                                    // Добавление расписания ко всем
                                    for (auto &gr : cl.assigned_groups){
                                        auto &ref_gr = ind.scheduleForGroups[gr.id];
                                        ref_gr.push_back(&sc);
                                    }
                                    for (auto &teacher : cl.assigned_teachers){
                                        auto &ref_teach = ind.scheduleForTeachers[teacher.id];
                                        ref_teach.push_back(&sc);
                                    }
                                    auto &ref_aud = ind.scheduleForAudiences[id_audience];
                                    ref_aud.push_back(&sc);

                                    Fitness(classes, ind, 0, max_day, penaltyGrWin, penaltyTeachWin, penaltySameTimesSc, penaltySameRecSc);
                                    auto tempFitness = ind.fitnessValue.fitnessValue;
                                    if (tempFitness < best_fitness){
                                        best_fitness = tempFitness;
                                        best_sc = schedule(number_pair, day_week, pair_type, id_audience, cl.id);
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
                        DAY_WEEK = best_sc.day_week;
                        NUMBER_PAIR = best_sc.number_pair;
                        PAIR_TYPE = best_sc.pair_type;
                    }
                    // Если найдены подходящие времена занятий, то выбрать случайное из них
                    else{
                        int r = GetRndInteger(0, INTERSECTION.size() - 1);
                        DAY_WEEK = INTERSECTION[r].day_week;
                        NUMBER_PAIR = INTERSECTION[r].number_pair;
                        PAIR_TYPE = INTERSECTION[r].pair_type;
                    }
                }
                auto sc = schedule(NUMBER_PAIR, DAY_WEEK, PAIR_TYPE, id_audience, cl.id);
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
                auto &ref_aud = ind.scheduleForAudiences[id_audience];
                ref_aud.push_back(ref);
            }
        }

        Fitness(classes, ind, 0, max_day, penaltyGrWin, penaltyTeachWin, penaltySameTimesSc, penaltySameRecSc);

        auto EndTime = chrono::high_resolution_clock::now();
        chrono::duration<float,std::milli> duration = EndTime - StartTime;

        result.push_back(make_pair(duration.count(), ind.fitnessValue.fitnessValue));
        auto best_individ = bestIndivid();
        best_individ.fitnessValue = ind.fitnessValue;
        for (auto &cl : classes)
        {
            for (auto &sc : cl.schedules[0])
            {
                best_individ.arr_schedule.push_back(schedule(sc.number_pair, sc.day_week, sc.pair_type, sc.id_audience, sc.id_class));
            }
        }
        json resultJson = json();
        resultJson["bestPopulation"] = best_individ.to_json();
        resultJson["result"] = result;

        ofstream fileResult(path+"\\result.json");
                if (fileResult.is_open()){
                    fileResult << resultJson << endl;
                }
    }
    catch (exception &ex)
    {
        cout << ex.what() << endl;
    }
    catch (...)
    {
        cout << "any mistake" << endl;
    }

    return 0;
}
