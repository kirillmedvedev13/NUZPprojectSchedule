#ifndef EVOLUTIONALGORITHM_HPP
#define EVOLUTIONALGORITHM_HPP

#include "../Libraries/TypeDefs.hpp"
#include "../Libraries/BS_thread_pool.hpp"
#include <vector>
#include <cstdlib>

using namespace std;
using namespace BS;

struct Popul
{
    fitness fitnessValue;
    int index;
    Popul()
    {
        fitnessValue = fitness();
        index = -1;
    }
    Popul(fitness fitnessValue, int index)
    {
        this->fitnessValue = fitnessValue;
        this->index = index;
    }
    bool operator<(const Popul &b)
    {
        if (this->fitnessValue.fitnessValue < b.fitnessValue.fitnessValue)
            return true;
        else
            return false;
    }
};

class EvolutionAlgorithm
{
    int population_size;
    int max_generations;
    double p_crossover;
    double p_mutation;
    double p_elitism;
    double penaltySameRecSc;
    double penaltyGrWin;
    double penaltyTeachWin;
    double penaltySameTimesSc;
    int num_elit;
    int number_pool;
    int max_day;
    int max_pair;
    vector<clas> classes;
    vector<audience> audiences;
    base_schedule bs;
    vector<individ> populations;
    bestIndivid bestPopulation;

    //___________________________________________________

    vector<int> GetPairTypeForClass(const clas &clas_)
    {
        vector<int> times;
        int times_per_week = clas_.times_per_week;
        if (times_per_week <= 1)
            times.push_back(GetRndInteger(1, 2));

        if (times_per_week > 1 && times_per_week <= 2)
        {
            times.push_back(GetRndInteger(1, 2));
            times.push_back(GetRndInteger(1, 2));
        }
        if (times_per_week > 2 && times_per_week <= 3)
        {
            double r = GetRndDouble();
            if (r <= 0.75)
            {
                times.push_back(3);
                times.push_back(GetRndInteger(1, 2));
            }
            else
            {
                times.push_back(GetRndInteger(1, 2));
                times.push_back(GetRndInteger(1, 2));
                times.push_back(GetRndInteger(1, 2));
            }
        }
        return times;
    }
    // 0.5 - 1 пара в 2 денели
    // 1 - 1 пара в 2 денели
    // 2 - 2 пары в 2 денели
    // 2.5 - 3 пары в 2 недели
    // 3 - 3 пары в 2 денели
    // 4 - 4 пары в 2 недели

    //___________________________________________________

    int GetRndInteger(int offset, int range)
    {
        if (range == 0)
            return 0;
        int r = offset + (rand() % static_cast<int>((range + 1) - offset));
        return r;
    }
    //___________________________________________________

    double GetRndDouble()
    {
        return (double)rand() / RAND_MAX;
    }

    //___________________________________________________

    int GetIdAudienceForClass(const clas &clas)
    {
        vector<int> detected_audiences;
        if (clas.recommended_audiences.size())
            detected_audiences.push_back(clas.recommended_audiences[GetRndInteger(0, clas.recommended_audiences.size() - 1)].id_audience);
        else
        {
            int sum_students = 0;
            for (auto ag : clas.assigned_groups)
            {
                sum_students += ag.number_students;
            }
            int id_cathedra = clas.id_cathedra;
            // Аудитории в кафедре занятия
            for (const auto &aud : audiences)
            {
                if (aud.capacity >= sum_students && aud.id_type_class == clas.id_type_class)
                {
                    for (auto cath : aud.cathedras)
                    {
                        if (cath == id_cathedra)
                        {
                            detected_audiences.push_back(aud.id);
                            break;
                        }
                    }
                }
            }
            // Если в кафедре нету ни одно аудитории
            if (!detected_audiences.size())
            {
                for (const auto &aud : audiences)
                {
                    if (aud.capacity >= sum_students && aud.id_type_class == clas.id_type_class)
                    {
                        detected_audiences.push_back(aud.id);
                    }
                }
                if (!detected_audiences.size())
                    return -1;
            }
        }
        return detected_audiences[GetRndInteger(0, detected_audiences.size() - 1)];
    }

    //___________________________________________________

    double FitnessWindows(vector<schedule *> &i_schedule, const int &max_day, const double &penaltyWin)
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
                    fitnessWindows += (schedule_bot[i + 1]->number_pair - schedule_bot[i]->number_pair - 1) * penaltyWin;
                }
            }
        }
        return fitnessWindows;
    }

    //___________________________________________________

    double FitnessRecommendSchedules(const vector<recommended_schedule> &rs, const vector<schedule> &sc, const double &penaltySameRecSc)
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

    //___________________________________________________

    double FitnessSameTimes(vector<schedule *> &i_schedule, const double &penaltySameTimesSc)
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

    //___________________________________________________

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
    //___________________________________________________

    void SortSchedule(vector<schedule *> &i_schedule)
    {
        // sort(i_schedule.begin(),i_schedule.end(), Compare);
        if (i_schedule.size() > 2)
        {
            for (size_t i = 0; i < i_schedule.size(); i++)
            {
                for (size_t j = 0; j < i_schedule.size() - 1; j++)
                {
                    if (Compare(i_schedule[j], i_schedule[j + 1]) == false)
                    {
                        auto t = i_schedule[j];
                        i_schedule[j] = i_schedule[j + 1];
                        i_schedule[j + 1] = t;
                    }
                }
            }
        }
    }

    //___________________________________________________

public:
    EvolutionAlgorithm(json data)
    {
        this->max_day = data["max_day"];
        this->max_pair = data["max_pair"];
        const json evolution_values = data["params"];
        this->population_size = evolution_values["population_size"];
        this->max_generations = evolution_values["max_generations"];
        this->p_crossover = evolution_values["p_crossover"];
        this->p_mutation = evolution_values["p_mutation"];
        this->p_elitism = evolution_values["p_elitism"];

        const json general_values = data["general_values"];
        this->penaltySameRecSc = general_values["penaltySameRecSc"];
        this->penaltyGrWin = general_values["penaltyGrWin"];
        this->penaltyTeachWin = general_values["penaltyTeachWin"];
        this->penaltySameTimesSc = general_values["penaltySameTimesSc"];
        this->num_elit = population_size * p_elitism;

        this->classes = vector<clas>();
        for (json cl : data["classes"])
        {
            classes.push_back(clas(cl, population_size));
        }

        this->audiences = vector<audience>();
        for (json &aud : data["audiences"])
        {
            audience new_aud(aud);
            audiences.push_back(new_aud);
        }

        this->bs = base_schedule(data["base_schedule"]["schedule_group"], data["base_schedule"]["schedule_teacher"], data["base_schedule"]["schedule_audience"]);

        populations = Init();

        bestPopulation = bestIndivid();
    }
    //___________________________________________________
    vector<individ> Init()
    {
        populations = vector<individ>(population_size);
        // Заполнение базового расписания
        for (int k = 0; k < population_size; k++)
        {
            for (auto &gr : bs.base_schedule_group)
            {
                auto id = gr.first;
                auto &t = populations[k].scheduleForGroups.at(id);
                for (auto &sc : gr.second)
                {
                    t.push_back(&sc);
                }
            }
            for (auto &teach : bs.base_schedule_teacher)
            {
                auto id = teach.first;
                auto &t = populations[k].scheduleForTeachers.at(id);
                for (auto &sc : teach.second)
                {
                    t.push_back(&sc);
                }
            }
            for (auto &aud : bs.base_schedule_audience)
            {
                auto id = aud.first;
                auto &t = populations[k].scheduleForAudiences.at(id);
                for (auto &sc : aud.second)
                {
                    t.push_back(&sc);
                }
            }
        }
        // Расстановка расписания для кафедры
        // В начальном варианте у всех индиводов расписание разное но одинаковое количество пар
        for (size_t i = 0; i < classes.size(); i++)
        {
            clas &clas = classes[i];
            vector<int> info = GetPairTypeForClass(clas);
            for (size_t j = 0; j < info.size(); j++)
            {
                for (int k = 0; k < population_size; k++)
                {
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
                    classes[i].schedules[k].push_back(schedule(number_pair, day_week, info[j], id_audience, clas.id));
                }
            }
        }
        // Расстановка ссылок на расписание
        for (int k = 0; k < population_size; k++)
        {
            for (size_t i = 0; i < classes.size(); i++)
            {
                clas &clas = classes[i];
                for (size_t j = 0; j < clas.schedules[k].size(); j++)
                {
                    auto ref = &clas.schedules[k][j];
                    for (auto gr : classes[i].assigned_groups)
                    {
                        auto &ref_gr = populations[k].scheduleForGroups[gr.id];
                        ref_gr.push_back(ref);
                    }
                    for (auto teach : classes[i].assigned_teachers)
                    {
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

    void Fitness(individ &i_schedule, const int &index)
    {
        for (auto &sc_gr : i_schedule.scheduleForGroups)
        {
            SortSchedule(sc_gr.second);
        }
        for (auto &sc_teach : i_schedule.scheduleForGroups)
        {
            SortSchedule(sc_teach.second);
        }
        for (auto &sc_aud : i_schedule.scheduleForGroups)
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
        for (auto &sc_gr : i_schedule.scheduleForGroups)
        {
            fitnessGrWin += FitnessWindows(sc_gr.second, max_day, penaltyGrWin);
            fitnessSameTimeGr += FitnessSameTimes(sc_gr.second, penaltySameTimesSc);
        }
        for (auto &sc_teach : i_schedule.scheduleForTeachers)
        {
            fitnessTeachWin += FitnessWindows(sc_teach.second, max_day, penaltyTeachWin);
            fitnessSameTimeTeach += FitnessSameTimes(sc_teach.second, penaltySameTimesSc);
        }
        for (auto &sc_aud : i_schedule.scheduleForAudiences)
        {
            fitnessSameTimeAud += FitnessSameTimes(sc_aud.second, penaltySameTimesSc);
        }
        for (auto &cl : classes)
        {
            if (cl.recommended_schedules.size() > 0)
            {
                fitnessRecSc += FitnessRecommendSchedules(cl.recommended_schedules, cl.schedules[index], penaltySameRecSc);
            }
        }
        fitnessValue = fitnessGrWin + fitnessSameTimeGr + fitnessTeachWin + fitnessSameTimeTeach + fitnessSameTimeAud + fitnessRecSc;
        i_schedule.fitnessValue = fitness(fitnessValue, fitnessGrWin, fitnessSameTimeGr, fitnessTeachWin, fitnessSameTimeTeach, fitnessSameTimeAud, fitnessRecSc);
    }

    void FitnessLoop(thread_pool &worker_pool)
    {
        for (int i = 0; i < population_size; i++)
        {
            auto &ind = this->populations[i];
            worker_pool.push_task([this, &ind, &i]()
                                  { Fitness(ind, i); });
        }
        worker_pool.wait_for_tasks();
    }

    //___________________________________________________

    void Crossing(const int &index1, const int &index2)
    {
        if (classes.size() > 1)
        {
            int index_class = GetRndInteger(0, classes.size() - 1);
            int index_pair = GetRndInteger(0, classes[index_class].schedules[index1].size() - 1);
            // Если аудитории разные, то менять указатели для каждой аудитории
            if (classes[index_class].schedules[index1][index_pair].id_audience != classes[index_class].schedules[index2][index_pair].id_audience)
            {
                // Найти ссылку на занятие для 1 аудитории и удалить
                auto id_aud1 = classes[index_class].schedules[index1][index_pair].id_audience;
                auto ref1 = &classes[index_class].schedules[index1][index_pair];
                auto it1 = find(populations[index1].scheduleForAudiences[id_aud1].begin(), populations[index1].scheduleForAudiences[id_aud1].end(), ref1);
                populations[index1].scheduleForAudiences[id_aud1].erase(it1);
                // Найти ссылку на занятие для 2 аудитории и удалить
                auto id_aud2 = classes[index_class].schedules[index2][index_pair].id_audience;
                auto ref2 = &classes[index_class].schedules[index2][index_pair];
                auto it2 = find(populations[index2].scheduleForAudiences[id_aud2].begin(), populations[index2].scheduleForAudiences[id_aud2].end(), ref2);
                populations[index2].scheduleForAudiences[id_aud2].erase(it2);

                // Вставить новые ссылки для аудиторий
                populations[index1].scheduleForAudiences[id_aud2].emplace(populations[index1].scheduleForAudiences[id_aud2].begin(), ref1);
                populations[index2].scheduleForAudiences[id_aud1].emplace(populations[index2].scheduleForAudiences[id_aud1].begin(), ref2);
            }
            // Поменять параметры занятий между друг другом
            auto sc1 = classes[index_class].schedules[index1][index_pair];
            classes[index_class].schedules[index1][index_pair] = classes[index_class].schedules[index2][index_pair];
            classes[index_class].schedules[index2][index_pair] = sc1;
        }
    }

    //___________________________________________________

    void CrossingLoop(thread_pool &worker_pool)
    {
        for (int i = 0; i < population_size; i += 2)
        {
            if (GetRndDouble() < p_crossover)
            {
                worker_pool.push_task([this, i]()
                                      { Crossing(i, i + 1); });
            }
        }
        worker_pool.wait_for_tasks();
    }

    //___________________________________________________

    void Mutation(const int &index)
    {
        // Случайное изменение пары для занятия
        int index_class = GetRndInteger(0, classes.size() - 1);
        int index_pair = GetRndInteger(0, classes[index_class].schedules[index].size() - 1);
        // если есть рекомендуемоемое время, то пару не менять
        int num_rec = classes[index_class].recommended_schedules.size();
        if (index_pair >= num_rec)
        {
            int day_week = GetRndInteger(1, max_day);
            int number_pair = GetRndInteger(1, max_pair);
            int new_id_audience = GetIdAudienceForClass(classes[index_class]);
            int old_id_audience = classes[index_class].schedules[index][index_pair].id_audience;
            int pair_type = classes[index_class].schedules[index][index_pair].pair_type;
            // С шансом 0.5 менять числитель на знаменатель
            if (pair_type < 3 && GetRndDouble() <= 0.5)
            {
                pair_type = 3 - pair_type;
            }
            classes[index_class].schedules[index][index_pair].day_week = day_week;
            classes[index_class].schedules[index][index_pair].number_pair = number_pair;
            classes[index_class].schedules[index][index_pair].pair_type = pair_type;
            // Замена ссылки для аудитории если аудитория поменялась
            if (old_id_audience != new_id_audience)
            {
                classes[index_class].schedules[index][index_pair].id_audience = new_id_audience;
                auto ref = &classes[index_class].schedules[index][index_pair];
                auto it = find(populations[index].scheduleForAudiences[old_id_audience].begin(), populations[index].scheduleForAudiences[old_id_audience].end(), ref);
                populations[index].scheduleForAudiences[old_id_audience].erase(it);
                populations[index].scheduleForAudiences[new_id_audience].emplace(populations[index].scheduleForAudiences[new_id_audience].begin(), ref);
            }
        }
    }

    //___________________________________________________

    void MutationLoop(thread_pool &worker_pool)
    {
        for (int i = 0; i < population_size; i++)
        {
            if (GetRndDouble() <= p_mutation)
            {
                worker_pool.push_task([this, i]()
                                      { Mutation(i); });
            }
        }
        worker_pool.wait_for_tasks();
    }

    //___________________________________________________

    void Selection()
    {

        SortPopulations();
        auto individ_indexes = vector<int>();
        for (int i = 0; i < population_size - num_elit; i++)
        {
            int i1 = 0;
            int i2 = 0;
            int i3 = 0;
            while (i1 == i2 || i2 == i3 || i1 == i3)
            {
                i1 = GetRndInteger(0, populations.size() - 1);
                i2 = GetRndInteger(0, populations.size() - 1);
                i3 = GetRndInteger(0, populations.size() - 1);
            }
            int winIndex;
            if (populations[i1].fitnessValue.fitnessValue < populations[i2].fitnessValue.fitnessValue && populations[i1].fitnessValue.fitnessValue < populations[i3].fitnessValue.fitnessValue)
                winIndex = i1;
            else if (populations[i2].fitnessValue.fitnessValue < populations[i1].fitnessValue.fitnessValue && populations[i2].fitnessValue.fitnessValue < populations[i3].fitnessValue.fitnessValue)
                winIndex = i2;
            else
                winIndex = i3;
            individ_indexes.push_back(winIndex);
        }

        // Запомнить расписание для его расстоновки по сортировке
        auto temp_classes = vector<vector<vector<schedule>>>(classes.size());
        for (size_t i = 0; i < classes.size(); i++)
        {
            temp_classes[i] = vector<vector<schedule>>(classes[i].schedules.size());
            for (size_t j = 0; j < classes[i].schedules.size(); j++)
            {
                temp_classes[i][j] = vector<schedule>(classes[i].schedules[j].size());
                for (size_t k = 0; k < classes[i].schedules[j].size(); k++)
                {
                    temp_classes[i][j][k] = classes[i].schedules[j][k];
                }
            }
        }

        for (int i = num_elit; i < population_size; i++)
        {
            // Ссылки ссылаются на занятия, остается поменять значение занятий на новые
            int new_index = individ_indexes[i - num_elit];
            for (size_t j = 0; j < classes.size(); j++)
            {
                for (size_t k = 0; k < classes[j].schedules[i].size(); k++)
                {
                    auto sc = temp_classes[j][new_index][k];
                    int old_id_audience = classes[j].schedules[i][k].id_audience;
                    int new_id_audience = sc.id_audience;
                    // Если ид аудитории поменялся, то нужно поменять ссылку на неё
                    if (new_id_audience != old_id_audience)
                    {
                        auto ref = &classes[j].schedules[i][k];
                        auto it = find(populations[i].scheduleForAudiences[old_id_audience].begin(), populations[i].scheduleForAudiences[old_id_audience].end(), ref);
                        populations[i].scheduleForAudiences[old_id_audience].erase(it);
                        populations[i].scheduleForAudiences[new_id_audience].emplace(populations[i].scheduleForAudiences[new_id_audience].begin(), ref);
                    }
                    // Поменять значение пары
                    classes[j].schedules[i][k] = sc;
                }
            }
        }
    }

    //___________________________________________________

    double MeanFitnessValue()
    {
        double sum = 0;
        for (size_t i = 0; i < populations.size(); i++)
        {
            sum += populations[i].fitnessValue.fitnessValue;
        }
        return sum / populations.size();
    }

    //___________________________________________________

    void MinFitnessValue()
    {
        double min = bestPopulation.fitnessValue.fitnessValue;
        int min_index = -1;
        for (size_t i = 0; i < populations.size(); i++)
        {
            if (populations[i].fitnessValue.fitnessValue < min)
            {
                min_index = i;
                min = populations[i].fitnessValue.fitnessValue;
            }
        }
        if (min_index != -1)
        {
            bestPopulation.arr_schedule.clear();
            bestPopulation.fitnessValue = populations[min_index].fitnessValue;
            for (auto &cl : classes)
            {
                for (auto &sc : cl.schedules[min_index])
                {
                    bestPopulation.arr_schedule.push_back(schedule(sc.number_pair, sc.day_week, sc.pair_type, sc.id_audience, sc.id_class));
                }
            }
        }
    }

    //___________________________________________________

    void SortPopulations()
    {
        // Получить новые индексы популяций
        auto vec_individs = vector<Popul>(populations.size());
        for (size_t i = 0; i < populations.size(); i++)
        {
            vec_individs[i] = Popul(populations[i].fitnessValue, i);
        }
        sort(vec_individs.begin(), vec_individs.end());

        // Запомнить расписание для его расстоновки по сортировке
        auto tClassses = vector<vector<vector<schedule>>>(classes.size());
        for (size_t i = 0; i < classes.size(); i++)
        {
            tClassses[i] = vector<vector<schedule>>(classes[i].schedules.size());
            for (size_t j = 0; j < classes[i].schedules.size(); j++)
            {
                tClassses[i][j] = vector<schedule>(classes[i].schedules[j].size());
                for (size_t k = 0; k < classes[i].schedules[j].size(); k++)
                {
                    tClassses[i][j][k] = classes[i].schedules[j][k];
                }
            }
        }

        // Переставить индивидов
        for (size_t i = 0; i < classes.size(); i++)
        {
            for (size_t j = 0; j < populations.size(); j++)
            {
                for (size_t k = 0; k < classes[i].schedules[j].size(); k++)
                {
                    int old_id_audience = tClassses[i][j][k].id_audience;
                    int new_id_audience = tClassses[i][vec_individs.at(j).index][k].id_audience;
                    // Поменять ссылки для аудиторий если они разные
                    if (new_id_audience != old_id_audience)
                    {
                        auto ref = &classes[i].schedules[j][k];
                        auto it = find(populations[j].scheduleForAudiences[old_id_audience].begin(), populations[j].scheduleForAudiences[old_id_audience].end(), ref);
                        populations[j].scheduleForAudiences[old_id_audience].erase(it);
                        populations[j].scheduleForAudiences[new_id_audience].emplace(populations[j].scheduleForAudiences[new_id_audience].begin(), ref);
                    }
                    classes[i].schedules[j][k] = tClassses[i][vec_individs[j].index][k];
                }
            }
        }
        for (size_t j = 0; j < populations.size(); j++)
        {
            populations[j].fitnessValue = vec_individs[j].fitnessValue;
        }
    }

    //___________________________________________________

    bestIndivid GetBestPopulation()
    {
        return bestPopulation;
    }
};

#endif