#ifndef SERVICE_HPP
#define SERVICE_HPP

#include "GetPairTypeForClass.hpp"
#include "TypeDefs.hpp"
#include "SetBaseScheduleToIndivid.hpp"
#include "GetRnd.hpp"
#include "GetIdAudienceForClass.hpp"

#include "fstream"

struct Clas{
    int day_week;
    int pair_type;
    int number_pair;
    int id_audience;
    int number_iter;
    Clas(int day_week, int number_pair, int pair_type,int audience, int number_iter){
        this->day_week = day_week;
        this->number_pair = number_pair;
        this->pair_type = pair_type;
        this->id_audience=audience;
        this->number_iter=number_iter;
    }
    Clas operator=(const Clas &b){
        return Clas(b.day_week, b.number_pair, b.pair_type,b.id_audience,b.number_iter);
    }
    bool operator==(const Clas &b) const{
        if (this->day_week == b.day_week && this->pair_type == b.pair_type && this->number_pair == b.number_pair)
            return true;
        return false;
    }

    schedule GetSchedule(int classId){
        return schedule(number_pair,day_week,pair_type,id_audience,classId);
    }


};

// клас для зберігання параметрів та методів
class Service{
public:
    double penaltySameRecSc;
    double penaltyGrWin;
    double penaltyTeachWin;
    double penaltySameTimesSc;
    int max_day;
    int max_pair;
    vector<clas> classes;
    vector<audience> audiences;
    base_schedule bs;
    vector<individ> populations;
    string type_initialization;
    string type_mutation;
    double p_mutation_gene;
    int population_size;
    bestIndivid bestIndiv;

    void InitService(json data, int population_size){
        bs = base_schedule(data["base_schedule"]["schedule_group"], data["base_schedule"]["schedule_teacher"], data["base_schedule"]["schedule_audience"]);
        max_day = data["max_day"];
        max_pair = data["max_pair"];
        this->population_size = population_size;
        penaltySameRecSc = data["general_values"]["penaltySameRecSc"];
        penaltyGrWin = data["general_values"]["penaltyGrWin"];
        penaltyTeachWin = data["general_values"]["penaltyTeachWin"];
        penaltySameTimesSc = data["general_values"]["penaltySameTimesSc"];

        //Добавление занятий
        classes = vector<clas>();
        for (json &cl : data["classes"]){
            classes.push_back(clas(cl, population_size));
        }

        //Добавление аудиторий
        audiences = vector<audience>();
        for (json &aud : data["audiences"]){
            audiences.push_back(audience(aud));
        }
        populations = vector<individ>(population_size);
        //Создание начального лучшего индивида
        bestIndiv = bestIndivid();
    }

    void InitServiceWithInitAndMut(json data, int population_size){
        InitService(data, population_size);
        type_mutation = data["params"]["type_mutation"];
        if (type_mutation == "all_genes"){
            p_mutation_gene = data["params"]["p_mutation_gene"];
        }
        type_initialization = data["params"]["type_initialization"];
    }

    void InitBaseSchedule(){
        // Заполнение базового расписания
        for (size_t k = 0; k < populations.size(); k++)
        {
            SetBaseScheduleToIndivid(populations[k], bs);
        }
    }

    void InitClasses(int index_individ, json data_SA = NULL){
        // Расстановка расписания случайным образом
        if (type_initialization == "random") {
            // В начальном варианте у всех индиводов расписание разное
            for (size_t i = 0; i < classes.size(); i++) {
                auto &clas = classes[i];
                auto info = GetPairTypeForClass(clas);
                for (size_t j = 0; j < info.size(); j++) {
                    int day_week, number_pair;
                    //Расстанока рекомендуемого расписания
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
                    classes[i].schedules[index_individ].push_back(schedule(number_pair, day_week, info[j], id_audience, clas.id));
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
                find_cl->schedules[index_individ].push_back(schedule(sc["number_pair"], sc["day_week"], sc["pair_type"], sc["id_audience"], id_class));
            }
        }
    }

    void InitClasses(json data_SA = NULL){
        for (size_t index_individ = 0; index_individ < populations.size(); index_individ++) {
            InitClasses(index_individ, data_SA);
        }
    }

    void InitPopulations(int index_individ){
        for (size_t index_class = 0; index_class < classes.size(); index_class++) {
            clas &clas = classes[index_class];
            for (size_t index_pair = 0; index_pair < clas.schedules[index_individ].size(); index_pair++) {
                auto ref = &clas.schedules[index_individ][index_pair];
                // Добавление указателя на занятие для груп
                for (auto &gr : classes[index_class].assigned_groups)
                {
                    auto &ref_gr = populations[index_individ].scheduleForGroups[gr.id];
                    ref_gr.push_back(ref);
                }
                // Добавление указателя на занятие для учителей
                for (auto &teach : classes[index_class].assigned_teachers)
                {
                    auto &ref_teach = populations[index_individ].scheduleForTeachers[teach.id];
                    ref_teach.push_back(ref);
                }
                // Добавление указателя на занятие для аудитории
                auto &ref_aud = populations[index_individ].scheduleForAudiences[clas.schedules[index_individ][index_pair].id_audience];
                ref_aud.push_back(ref);
            }
        }
    }

    void InitPopulations()
    {
        // Расстановка ссылок на расписание для индивидов
        for (size_t index_individ = 0; index_individ < populations.size(); index_individ++) {
            InitPopulations(index_individ);
        }
    }

    void ClearIndivid(int index_individ){
        for (auto &cl : classes){
            for (auto &sc : cl.schedules[index_individ]){
                auto ref = &sc;
                // Удаление указателя на занятие для груп
                for (auto &gr : cl.assigned_groups)
                {
                    auto it = find(populations[index_individ].scheduleForGroups[gr.id].begin(), populations[index_individ].scheduleForGroups[gr.id].end(), ref);
                    populations[index_individ].scheduleForGroups[gr.id].erase(it);
                }
                // Удаление указателя на занятие для учителей
                for (auto &teach : cl.assigned_teachers)
                {
                    auto it = find(populations[index_individ].scheduleForTeachers[teach.id].begin(), populations[index_individ].scheduleForTeachers[teach.id].end(), ref);
                    populations[index_individ].scheduleForTeachers[teach.id].erase(it);
                }
                // Добавление указателя на занятие для аудитории
                auto it = find(populations[index_individ].scheduleForAudiences[sc.id_audience].begin(), populations[index_individ].scheduleForAudiences[sc.id_audience].end(), ref);
                populations[index_individ].scheduleForAudiences[sc.id_audience].erase(it);
            }
            cl.schedules[index_individ].clear();
        }
    }

    void SetIndivid(int index_main_individ, int index_copied_individ){
        for (auto &cl : classes){
            for (auto &sc : cl.schedules[index_copied_individ]){
                cl.schedules[index_main_individ].push_back(sc);
            }
        }
        populations[index_main_individ].fitnessValue = populations[index_copied_individ].fitnessValue;
    }

    //Получить лучшего индивида. Вызивать только если обновлены фитнес значения
    bestIndivid GetBestIndivid()
    {
        int best_index = -1;
        auto minFitness = bestIndiv.fitnessValue.fitnessValue;
        for (size_t i = 0; i < populations.size(); i++){
            if (populations[i].fitnessValue.fitnessValue <= minFitness){
                minFitness = populations[i].fitnessValue.fitnessValue;
                best_index = i;
            }
        }
        if (best_index != -1){
            bestIndiv.arr_schedule.clear();
            bestIndiv.fitnessValue = populations[best_index].fitnessValue;
            for (auto &cl : classes)
            {
                for (auto &sc : cl.schedules[best_index])
                {
                    bestIndiv.arr_schedule.push_back(schedule(sc.number_pair, sc.day_week, sc.pair_type, sc.id_audience, sc.id_class));
                }
            }
        }
        return bestIndiv;
    }

    //  Сохранение результатов в файл result.json
    static void SaveResults(bestIndivid &best_individ, string &path, vector<pair<int, double>> &result){
        json resultJson = json();
        resultJson["bestPopulation"] = best_individ.to_json();
        resultJson["result"] = result;
        ofstream fileResult(path+"\\result.json");
        if (fileResult.is_open()){
            fileResult << resultJson << endl;
        }
    }

    //Подсчет среднего значение фитнеса по популяции
    double GetMeanFitnessValue()
    {
        double sum = 0;
        for (size_t i = 0; i < populations.size(); i++)
        {
            sum += populations[i].fitnessValue.fitnessValue;
        }
        return sum / populations.size();
    }

    //Замена одной пары у занятия на переданное
    void SwapSchedule(int index_individ, schedule *ref, schedule sc){
        int old_id_audience = ref->id_audience;
        int new_id_audience = sc.id_audience;
        // Если ид аудитории поменялся, то нужно поменять указатель на неё
        if (new_id_audience != old_id_audience)
        {
            auto it = find(populations[index_individ].scheduleForAudiences[old_id_audience].begin(), populations[index_individ].scheduleForAudiences[old_id_audience].end(), ref);
            populations[index_individ].scheduleForAudiences[old_id_audience].erase(it);
            populations[index_individ].scheduleForAudiences[new_id_audience].push_back(ref);
        }
        // Поменять значение пары у занятия
        *ref = sc;
    }

    //Полная замена пар у занятия на переданные
    void SwapSchedule(int index_clas, int index_individ, vector<schedule> &new_schedules){
        // Сперва нужно пройтись по всем и поудалять указатели на пары
        for (auto &ref_pair: classes[index_clas].schedules[index_individ]){
            auto pointer_pair = &ref_pair;
            auto it = find(populations[index_individ].scheduleForAudiences[ref_pair.id_audience].begin(), populations[index_individ].scheduleForAudiences[ref_pair.id_audience].end(), pointer_pair);
            populations[index_individ].scheduleForAudiences[ref_pair.id_audience].erase(it);
            for (auto &gr: classes[index_clas].assigned_groups){
                it = find(populations[index_individ].scheduleForGroups[gr.id].begin(), populations[index_individ].scheduleForGroups[gr.id].end(), pointer_pair);
                populations[index_individ].scheduleForGroups[gr.id].erase(it);
            }
            for (auto &teach: classes[index_clas].assigned_teachers){
                it = find(populations[index_individ].scheduleForTeachers[teach.id].begin(), populations[index_individ].scheduleForTeachers[teach.id].end(), pointer_pair);
                populations[index_individ].scheduleForTeachers[teach.id].erase(it);
            }

        }
        classes[index_clas].schedules[index_individ].resize(new_schedules.size());
        // Затем заново расставить ссылки у всех
        for (size_t i = 0; i < new_schedules.size(); i++){
            classes[index_clas].schedules[index_individ][i] = new_schedules[i];
            auto pointer_pair = &classes[index_clas].schedules[index_individ][i];
            populations[index_individ].scheduleForAudiences[pointer_pair->id_audience].push_back(pointer_pair);
            for (auto &gr: classes[index_clas].assigned_groups){
                populations[index_individ].scheduleForGroups[gr.id].push_back(pointer_pair);
            }
            for (auto &teach: classes[index_clas].assigned_teachers){
                populations[index_individ].scheduleForTeachers[teach.id].push_back(pointer_pair);
            }
        }
    }

    //Обмен пар у занятия между индивидами
    void SwapSchedule(int index_clas, int index_individ_1, int index_individ_2){
        // Сначало нужно сохранить вектор пар у первого индивида
        auto temp_schedule1 = classes[index_clas].schedules[index_individ_1];
        // Затем нужно пройтись по всем и поудалять указатели на пары у первого индивида
        for (auto &ref_pair: classes[index_clas].schedules[index_individ_1]){
            auto pointer_pair = &ref_pair;
            auto it = find(populations[index_individ_1].scheduleForAudiences[ref_pair.id_audience].begin(), populations[index_individ_1].scheduleForAudiences[ref_pair.id_audience].end(), pointer_pair);
            populations[index_individ_1].scheduleForAudiences[ref_pair.id_audience].erase(it);
            for (auto &gr: classes[index_clas].assigned_groups){
                it = find(populations[index_individ_1].scheduleForGroups[gr.id].begin(), populations[index_individ_1].scheduleForGroups[gr.id].end(), pointer_pair);
                populations[index_individ_1].scheduleForGroups[gr.id].erase(it);
            }
            for (auto &teach: classes[index_clas].assigned_teachers){
                it = find(populations[index_individ_1].scheduleForTeachers[teach.id].begin(), populations[index_individ_1].scheduleForTeachers[teach.id].end(), pointer_pair);
                populations[index_individ_1].scheduleForTeachers[teach.id].erase(it);
            }

        }
        classes[index_clas].schedules[index_individ_1].resize(classes[index_clas].schedules[index_individ_2].size());
        // Затем заново расставить ссылки у всех у первого индивида
        for (size_t i = 0; i < classes[index_clas].schedules[index_individ_2].size(); i++){
            classes[index_clas].schedules[index_individ_1][i] = classes[index_clas].schedules[index_individ_2][i];
            auto pointer_pair = &classes[index_clas].schedules[index_individ_1][i];
            populations[index_individ_1].scheduleForAudiences[pointer_pair->id_audience].push_back(pointer_pair);
            for (auto &gr: classes[index_clas].assigned_groups){
                populations[index_individ_1].scheduleForGroups[gr.id].push_back(pointer_pair);
            }
            for (auto &teach: classes[index_clas].assigned_teachers){
                populations[index_individ_1].scheduleForTeachers[teach.id].push_back(pointer_pair);
            }
        }
        // Затем нужно пройтись по всем и поудалять указатели на пары у второго индивида
        for (auto &ref_pair: classes[index_clas].schedules[index_individ_2]){
            auto pointer_pair = &ref_pair;
            auto it = find(populations[index_individ_2].scheduleForAudiences[ref_pair.id_audience].begin(), populations[index_individ_2].scheduleForAudiences[ref_pair.id_audience].end(), pointer_pair);
            populations[index_individ_2].scheduleForAudiences[ref_pair.id_audience].erase(it);
            for (auto &gr: classes[index_clas].assigned_groups){
                it = find(populations[index_individ_2].scheduleForGroups[gr.id].begin(), populations[index_individ_2].scheduleForGroups[gr.id].end(), pointer_pair);
                populations[index_individ_2].scheduleForGroups[gr.id].erase(it);
            }
            for (auto &teach: classes[index_clas].assigned_teachers){
                it = find(populations[index_individ_2].scheduleForTeachers[teach.id].begin(), populations[index_individ_2].scheduleForTeachers[teach.id].end(), pointer_pair);
                populations[index_individ_2].scheduleForTeachers[teach.id].erase(it);
            }

        }
        classes[index_clas].schedules[index_individ_2].resize(temp_schedule1.size());
        // Затем заново расставить ссылки у всех у второго индивида
        for (size_t i = 0; i < temp_schedule1.size(); i++){
            classes[index_clas].schedules[index_individ_2][i] = temp_schedule1[i];
            auto pointer_pair = &classes[index_clas].schedules[index_individ_2][i];
            populations[index_individ_2].scheduleForAudiences[pointer_pair->id_audience].push_back(pointer_pair);
            for (auto &gr: classes[index_clas].assigned_groups){
                populations[index_individ_2].scheduleForGroups[gr.id].push_back(pointer_pair);
            }
            for (auto &teach: classes[index_clas].assigned_teachers){
                populations[index_individ_2].scheduleForTeachers[teach.id].push_back(pointer_pair);
            }
        }
    }

    //Функция мутации для индивида
    void Mutation(int index_individ){
        // Случайное изменение пары для занятия
        if(type_mutation == "custom_one_gene"){
            int index_class = GetRndInteger(0, classes.size() - 1);
            int index_pair = GetRndInteger(0, classes[index_class].schedules[index_individ].size() - 1);
            // если есть рекомендуемоемое время, то пару не менять
            int num_rec = classes[index_class].recommended_schedules.size();
            //Если у занятия нету рекомендуемого времени
            if (index_pair >= num_rec)
            {
                int day_week = GetRndInteger(1, max_day);
                int number_pair = GetRndInteger(1, max_pair);
                int new_id_audience = GetIdAudienceForClass(classes[index_class], audiences);
                int pair_type = classes[index_class].schedules[index_individ][index_pair].pair_type;
                // С шансом 0.5 менять числитель на знаменатель
                if (pair_type < 3 && GetRndDouble() <= 0.5)
                {
                    pair_type = 3 - pair_type;
                }
                auto sc = schedule(number_pair, day_week, pair_type, new_id_audience, classes[index_class].id);
                SwapSchedule(index_individ, &classes[index_class].schedules[index_individ][index_pair], sc);
            }
        }
        // Изменение всех пар для занятия в зависимости от шанса
        else if (type_mutation == "all_genes"){
            for(size_t index_class = 0; index_class < classes.size(); index_class++){
                for(size_t index_pair = 0; index_pair < classes[index_class].schedules[index_individ].size(); index_pair++){
                    int num_rec = classes[index_class].recommended_schedules.size();
                    // Если у занятия нету рекомендуемого времени
                    if ((int)index_pair >= num_rec){
                        // Если нужно мутировать пару
                        if (GetRndDouble() <= p_mutation_gene){
                            int day_week = GetRndInteger(1, max_day);
                            int number_pair = GetRndInteger(1, max_pair);
                            int new_id_audience = GetIdAudienceForClass(classes[index_class], audiences);
                            int pair_type = classes[index_class].schedules[index_individ][index_pair].pair_type;
                            // С шансом 0.5 менять числитель на знаменатель
                            if (pair_type < 3 && GetRndDouble() <= 0.5)
                            {
                                pair_type = 3 - pair_type;
                            }
                            auto sc = schedule(number_pair, day_week, pair_type, new_id_audience, classes[index_class].id);
                            SwapSchedule(index_individ, &classes[index_class].schedules[index_individ][index_pair], sc);
                        }
                    }
                }
            }
        }
    }
    void Mutation(int index_individ,map<int,vector<Clas>> &tabuList, int &iter){
        // Случайное изменение пары для занятия
        if(type_mutation == "custom_one_gene"){
            int index_class = GetRndInteger(0, classes.size() - 1);
            int index_pair = GetRndInteger(0, classes[index_class].schedules[index_individ].size() - 1);
            // если есть рекомендуемоемое время, то пару не менять
            int num_rec = classes[index_class].recommended_schedules.size();

            //Если у занятия нету рекомендуемого времени
            if (index_pair >= num_rec)
            {
                int day_week = GetRndInteger(1, max_day);
                int number_pair = GetRndInteger(1, max_pair);
                int new_id_audience = GetIdAudienceForClass(classes[index_class], audiences);
                int pair_type = classes[index_class].schedules[index_individ][index_pair].pair_type;
                // С шансом 0.5 менять числитель на знаменатель
                if (pair_type < 3 && GetRndDouble() <= 0.5)
                {
                    pair_type = 3 - pair_type;
                }
                auto sc = schedule(number_pair, day_week, pair_type, new_id_audience, classes[index_class].id);
                SwapSchedule(index_individ, &classes[index_class].schedules[index_individ][index_pair], sc);

                auto &clasList = tabuList[classes[index_class].id];
                clasList.push_back(Clas(day_week,number_pair,pair_type, new_id_audience, iter));

            }
        }
        // Изменение всех пар для занятия в зависимости от шанса
        else if (type_mutation == "all_genes"){
            for(size_t index_class = 0; index_class < classes.size(); index_class++){
                for(size_t index_pair = 0; index_pair < classes[index_class].schedules[index_individ].size(); index_pair++){
                    int num_rec = classes[index_class].recommended_schedules.size();
                    // Если у занятия нету рекомендуемого времени
                    if ((int)index_pair >= num_rec){
                        // Если нужно мутировать пару
                        if (GetRndDouble() <= p_mutation_gene){
                            int day_week = GetRndInteger(1, max_day);
                            int number_pair = GetRndInteger(1, max_pair);
                            int new_id_audience = GetIdAudienceForClass(classes[index_class], audiences);
                            int pair_type = classes[index_class].schedules[index_individ][index_pair].pair_type;
                            // С шансом 0.5 менять числитель на знаменатель
                            if (pair_type < 3 && GetRndDouble() <= 0.5)
                            {
                                pair_type = 3 - pair_type;
                            }
                            auto sc = schedule(number_pair, day_week, pair_type, new_id_audience, classes[index_class].id);
                            SwapSchedule(index_individ, &classes[index_class].schedules[index_individ][index_pair], sc);

                            auto &clasList = tabuList[classes[index_class].id];
                            clasList.push_back(Clas(day_week,number_pair,pair_type, new_id_audience,iter));
                        }
                    }
                }
            }
        }
    }

    //Подсчет окон для определнного расписания
    double FitnessWindows(vector<schedule *> &i_schedule, double &penaltyWin)
    {
        double fitnessWindows = 0;
        for (int current_day = 1; current_day <= max_day; current_day++)
        {
            auto schedule_top = vector<schedule *>();
            auto schedule_bot = vector<schedule *>();
            copy_if(i_schedule.begin(), i_schedule.end(), back_inserter(schedule_top), [&current_day](schedule *p)
                    { return (p->day_week == current_day && (p->pair_type == 1 || p->pair_type == 3)); });
            copy_if(i_schedule.begin(), i_schedule.end(), back_inserter(schedule_bot), [&current_day](schedule *p)
                    { return (p->day_week == current_day && (p->pair_type == 2 || p->pair_type == 3)); });
            auto array = vector<pair<schedule *, schedule *>>();
            // Числитель и Общие
            int s = schedule_top.size() - 1;
            for (int i = 0; i < s; i++)
            {
                auto diff = (schedule_top[i + 1]->number_pair - schedule_top[i]->number_pair);
                if (diff > 1)
                {
                    fitnessWindows += diff * penaltyWin;
                }
                // Запомнить окно между общими парами что бы в знаменателе их не повторять
                if (schedule_top[i + 1]->pair_type == 3 && schedule_top[i]->pair_type == 3)
                {
                    array.push_back(make_pair(schedule_top[i], schedule_top[i + 1]));
                }
            }
            // Знаменатель
            s = schedule_bot.size() - 1;
            for (int i = 0; i < s; i++)
            {
                auto diff = (schedule_bot[i + 1]->number_pair - schedule_bot[i]->number_pair);
                if (diff > 1)
                {
                    if (schedule_bot[i + 1]->pair_type == 3 && schedule_bot[i]->pair_type == 3)
                    {
                        auto res = find_if(array.begin(), array.end(), [&i, &schedule_bot](const pair<schedule *, schedule *> &p)
                                           { return (p.first == schedule_bot[i] && p.second == schedule_bot[i + 1]); });
                        if (res != array.end())
                            continue;
                    }
                    fitnessWindows += diff * penaltyWin;
                }
            }
        }
        return fitnessWindows;
    }

    //Подсчет неправильно расставленных рекомендуемого времени
    double FitnessRecommendSchedules(const vector<recommended_schedule> &rs, const vector<schedule> &sc)
    {
        double fitnessSameRecSc = 0;
        for (size_t i = 0; i < sc.size(); i++)
        {
            if (sc[i].day_week != rs[i].day_week || sc[i].number_pair != rs[i].number_pair)
            {
                fitnessSameRecSc += penaltySameRecSc;
            }
        }
        return fitnessSameRecSc;
    }

    //Подсчет накладания занятий для переданного расписания
    double FitnessSameTimes(vector<schedule *> &i_schedule)
    {
        double fitnessSameTimes = 0;
        schedule *lastTop = nullptr;
        schedule *lastBot = nullptr;
        schedule *lastTotal = nullptr;
        int cur_day = -1;
        int s = i_schedule.size() - 1;
        for (int i = -1; i < s; i++)
        {
            if (i_schedule[i + 1]->day_week != cur_day)
            {
                cur_day = i_schedule[i + 1]->day_week;
                lastTop = nullptr;
                lastBot = nullptr;
                lastTotal = nullptr;
                continue;
            }
            switch (i_schedule[i]->pair_type)
            {
            case 1:
                lastTop = i_schedule[i];
                break;
            case 2:
                lastBot = i_schedule[i];
                break;
            case 3:
                lastTotal = i_schedule[i];
                break;
            }
            if (i_schedule[i + 1]->number_pair == i_schedule[i]->number_pair)
            {
                if (i_schedule[i + 1]->pair_type == 1)
                {
                    auto top = lastTop != nullptr ? (lastTop->number_pair == i_schedule[i + 1]->number_pair) : false;
                    auto tot = lastTotal != nullptr ? (lastTotal->number_pair == i_schedule[i + 1]->number_pair) : false;
                    if (top || tot)
                    {
                        fitnessSameTimes += penaltySameTimesSc;
                        continue;
                    }
                }
                if (i_schedule[i + 1]->pair_type == 2)
                {
                    auto bot = lastBot != nullptr ? (lastBot->number_pair == i_schedule[i + 1]->number_pair) : false;
                    auto tot = lastTotal != nullptr ? (lastTotal->number_pair == i_schedule[i + 1]->number_pair) : false;
                    if (bot || tot)
                    {
                        fitnessSameTimes += penaltySameTimesSc;
                        continue;
                    }
                }
                if (i_schedule[i + 1]->pair_type == 3)
                {
                    auto bot = lastBot != nullptr ? (lastBot->number_pair == i_schedule[i + 1]->number_pair) : false;
                    auto top = lastTop != nullptr ? (lastTop->number_pair == i_schedule[i + 1]->number_pair) : false;
                    auto tot = lastTotal != nullptr ? (lastTotal->number_pair == i_schedule[i + 1]->number_pair) : false;
                    if (bot || top || tot)
                    {
                        fitnessSameTimes += penaltySameTimesSc;
                        continue;
                    }
                }
            }
        }
        return fitnessSameTimes;
    }

    //Исользуеться для сортировки определенного расписания
    static bool CompareSchedule(schedule *a, schedule *b)
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

    //Сортировка расписания пузырем
    void SortSchedule(vector<schedule *> &i_schedule)
    {
        if (i_schedule.size() > 2)
        {
            for (size_t i = 0; i < i_schedule.size(); i++)
            {
                for (size_t j = 0; j < i_schedule.size() - 1; j++)
                {
                    if (CompareSchedule(i_schedule[j], i_schedule[j + 1]) == false)
                    {
                        auto t = i_schedule[j];
                        i_schedule[j] = i_schedule[j + 1];
                        i_schedule[j + 1] = t;
                    }
                }
            }
        }
    }

    //Подсчет общего фитнеса для определенного индивида
    void Fitness(int index_individ){
        for (auto &sc_gr : populations[index_individ].scheduleForGroups)
        {
            SortSchedule(sc_gr.second);
        }
        for (auto &sc_teach : populations[index_individ].scheduleForTeachers)
        {
            SortSchedule(sc_teach.second);
        }
        for (auto &sc_aud : populations[index_individ].scheduleForAudiences)
        {
            SortSchedule(sc_aud.second);
        }
        double fitnessValue = 0;
        double fitnessGrWin = 0;
        double fitnessSameTimeGr = 0;
        double fitnessTeachWin = 0;
        double fitnessSameTimeTeach = 0;
        double fitnessSameTimeAud = 0;
        double fitnessRecSc = 0;
        //Подсчет фитнеса для груп - окна и накладки занятий
        for (auto &sc_gr : populations[index_individ].scheduleForGroups)
        {
            fitnessGrWin += FitnessWindows(sc_gr.second, penaltyGrWin);
            fitnessSameTimeGr += FitnessSameTimes(sc_gr.second);
        }
        //Подсчет фитнеса для учителей - окна и накладки занятий
        for (auto &sc_teach : populations[index_individ].scheduleForTeachers)
        {
            fitnessTeachWin += FitnessWindows(sc_teach.second, penaltyTeachWin);
            fitnessSameTimeTeach += FitnessSameTimes(sc_teach.second);
        }
        //Подсчет фитнеса для аудиторий - накладки занятий
        for (auto &sc_aud : populations[index_individ].scheduleForAudiences)
        {
            fitnessSameTimeAud += FitnessSameTimes(sc_aud.second);
        }
        //Подсчет фитнеса для рекомендуемых занятий
        for (auto &cl : classes)
        {
            if (cl.recommended_schedules.size() > 0)
            {
                fitnessRecSc += FitnessRecommendSchedules(cl.recommended_schedules, cl.schedules[index_individ]);
            }
        }
        fitnessValue = fitnessGrWin + fitnessSameTimeGr + fitnessTeachWin + fitnessSameTimeTeach + fitnessSameTimeAud + fitnessRecSc;
        populations[index_individ].fitnessValue = fitness(fitnessValue, fitnessGrWin, fitnessSameTimeGr, fitnessTeachWin, fitnessSameTimeTeach, fitnessSameTimeAud, fitnessRecSc);
    }

};

#endif // SERVICE_H
