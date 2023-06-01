#include "../ServiceCPP/BS_thread_pool.hpp"
#include "../ServiceCPP/json.hpp"
#include "../ServiceCPP/Service.hpp"
#include "../ServiceCPP/TypeDefs.hpp"
#include "../ServiceCPP/SetBaseScheduleToIndivid.hpp"
#include "../ServiceCPP/GetPairTypeForClass.hpp"
#include "../ServiceCPP/GetIdAudienceForClass.hpp"

#include <iostream>
#include <filesystem>
#include <fstream>
#include <chrono>
#include <climits>
#include <set>

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
        if (this->day_week < b.day_week && this->pair_type < b.pair_type && this->number_pair < b.number_pair)
            return true;
        return false;
    }
};

bool Compare(schedule *a, schedule *b)
{
    if (a->day_week < b->day_week)
        return true;
    if (a->day_week > b->day_week)
        return false;
    if (a->number_pair < b->number_pair)
        return true;
    if (a->number_pair > b->number_pair)
        return false;
    if (a->pair_type < b->pair_type)
        return true;
    if (a->pair_type > b->pair_type)
        return false;
    return false;
}

vector<Clas> GetIntersectionForArraySomeOne(map<int, vector<schedule *>> &scheduleForSomeOne, vector<ContainId> vectorSomeOne,
                                            int &max_day, int &max_pair, int _pair_type, bool needConsiderWindow = true){
    auto INTERSECTION = vector<Clas>();
    // Поиск свободного дня и номера пары
    auto arr_some = vector<vector<Clas>>();
    for (auto &some : vectorSomeOne){
        // Создание вектора если он не создан
        auto res_map = scheduleForSomeOne.find(some.id);
        if (res_map == scheduleForSomeOne.end()){
            scheduleForSomeOne.insert(make_pair(some.id, vector<schedule *>()));
        }
        // сортировка расписания
        sort(scheduleForSomeOne[some.id].begin(), scheduleForSomeOne[some.id].end(), Compare);
        auto temp_set_no_overlay = vector<Clas>();
        auto temp_set_no_window = vector<Clas>();
        // Нужно добавить в сет все свободные пары
        for (int day_week = 1; day_week <= max_day; day_week++){
            bool is_exist_pair_in_day;
            if (needConsiderWindow){
                auto res = find_if(scheduleForSomeOne[some.id].begin(), scheduleForSomeOne[some.id].end(), [&day_week](schedule *sc){
                    return sc->day_week == day_week;
                });
                if (res != scheduleForSomeOne[some.id].end()){
                    is_exist_pair_in_day = true;
                }
                else{
                    is_exist_pair_in_day = false;
                }
            }
            for (int number_pair = 1; number_pair <= max_pair; number_pair++){
                for (int pair_type = 1; pair_type <= 3; pair_type++){
                    auto res_overlay = find_if(scheduleForSomeOne[some.id].begin(), scheduleForSomeOne[some.id].end(), [&day_week, &number_pair, &pair_type](schedule *sc){
                        return sc->number_pair == number_pair && sc->day_week == day_week &&  sc->pair_type == pair_type;
                    });
                    bool is_overlay = true;
                    if (res_overlay == scheduleForSomeOne[some.id].end()){
                        is_overlay = false;
                        // Если числитель или знаменатель, то добавлять и то и то
                        if ((_pair_type == 1 || _pair_type == 2) && (pair_type == 1 || pair_type == 2))
                            temp_set_no_overlay.push_back(Clas(day_week, number_pair, pair_type));
                        // Если общая пара, то добавлять только её
                        else if (_pair_type == 3 && pair_type == 3)
                            temp_set_no_overlay.push_back(Clas(day_week, number_pair, pair_type));
                    }
                    if (needConsiderWindow){
                        // Если не существует первой пары в день, то добавлять любую пару
                        if (!is_exist_pair_in_day){
                            temp_set_no_window.push_back(Clas(day_week, number_pair, pair_type));
                        }
                        // Иначе нужно искать ближаюшую пару снизу и сверху и смотреть их разницу
                        else{
                            auto res_find_up = find_if(scheduleForSomeOne[some.id].begin(), scheduleForSomeOne[some.id].end(), [&day_week, &number_pair, &pair_type, &is_overlay](schedule *sc){
                                return sc->number_pair - number_pair == 1 && sc->pair_type == pair_type && sc->day_week == day_week && is_overlay == false;
                            });
                            if (res_find_up != scheduleForSomeOne[some.id].end()){
                                temp_set_no_window.push_back(Clas(day_week, number_pair, pair_type));
                            }
                            auto res_find_down = find_if(scheduleForSomeOne[some.id].begin(), scheduleForSomeOne[some.id].end(), [&day_week, &number_pair, &pair_type, &is_overlay](schedule *sc){
                                return number_pair - sc->number_pair == 1 && sc->pair_type == pair_type && sc->day_week == day_week && is_overlay == false;
                            });
                            if (res_find_down != scheduleForSomeOne[some.id].end()){
                                temp_set_no_window.push_back(Clas(day_week, number_pair, pair_type));
                            }
                        }
                    }

                }
            }
        }
        // Пересечение занятий без окон и накладок
        if (needConsiderWindow){
            auto temp = vector<Clas>();
            set_intersection(temp_set_no_overlay.begin(), temp_set_no_overlay.end(), temp_set_no_window.begin(), temp_set_no_window.end(), back_inserter(temp));
            arr_some.push_back(temp);
        }
        // Пересечение только без накладок
        else{
            arr_some.push_back(temp_set_no_overlay);
        }

    }
    // Если только одна группа
    if (arr_some.size() == 1){
        for (auto &cl : arr_some[0]){
            INTERSECTION.push_back(cl);
        }
    }else if (arr_some.size() > 1){
        auto temp_arr = vector<vector<Clas>>(arr_some.size() - 1);
        // Выбор свободных пар среди всех групп у занятия
        for (size_t i = 0; i < arr_some.size() - 1; i++){
            if (i != 0){
                set_intersection(temp_arr[i-1].begin(), temp_arr[i-1].end(), arr_some[i+1].begin(), arr_some[i+1].end(), back_inserter(temp_arr[i]));
            }
            else
                set_intersection(arr_some[i].begin(), arr_some[i].end(), arr_some[i+1].begin(), arr_some[i+1].end(), back_inserter(temp_arr[i]));
        }
        for (auto &cl : temp_arr[temp_arr.size() - 1]){
            INTERSECTION.push_back(cl);
        }
    }
    return INTERSECTION;
}

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

                    auto vec_groups = vector<ContainId>(cl.assigned_groups.size());
                    for (size_t i = 0; i < cl.assigned_groups.size(); i++){
                        vec_groups[i] = cl.assigned_groups[i];
                    }
                    INTERSECTION_GROUPS = GetIntersectionForArraySomeOne(ind.scheduleForGroups, vec_groups, max_day, max_pair, info[j]);

                    auto vec_teachers = vector<ContainId>(cl.assigned_teachers.size());
                    for (size_t i = 0; i < cl.assigned_teachers.size(); i++){
                        vec_teachers[i] = cl.assigned_teachers[i];
                    }
                    INTERSECTION_TEACHERS = GetIntersectionForArraySomeOne(ind.scheduleForGroups, vec_teachers, max_day, max_pair, info[j]);

                    auto vec_audiences = vector<ContainId>(1);
                    vec_audiences[0] = ContainId(id_audience);
                    INTERSECTION_AUDIENCES = GetIntersectionForArraySomeOne(ind.scheduleForGroups, vec_teachers, max_day, max_pair, info[j], false);

                    auto INTERSECTION = vector<Clas>();
                    auto tempInter = vector<Clas>();
                    set_intersection(INTERSECTION_GROUPS.begin(), INTERSECTION_GROUPS.end(), INTERSECTION_TEACHERS.begin(), INTERSECTION_TEACHERS.end(), back_inserter(tempInter));
                    set_intersection(tempInter.begin(), tempInter.end(), INTERSECTION_AUDIENCES.begin(), INTERSECTION_AUDIENCES.end(), back_inserter(INTERSECTION));

                    // Если вообще не нашло подходящего времени, то выбрать полность случайные значения
                    if(INTERSECTION.size() == 0){
                        DAY_WEEK = GetRndInteger(1, max_day);
                        NUMBER_PAIR = GetRndInteger(1, max_pair);
                        PAIR_TYPE = info[j];
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
                cl.schedules[0].push_back(sc);
                auto ref = &cl.schedules[0][cl.schedules[0].size()-1];
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


            auto EndTime = chrono::high_resolution_clock::now();
            chrono::duration<float,std::milli> duration = EndTime - StartTime;

            result.push_back(make_pair(duration.count(), ind.fitnessValue.fitnessValue));
            ofstream fileResult(path+"\\result.json");
            //        if (fileResult.is_open()){
            //            fileResult << resultJson << endl;
            //        }
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
