#ifndef EVOLUTIONALGORITHM_HPP
#define EVOLUTIONALGORITHM_HPP

#include "../ServiceCPP/TypeDefs.hpp"
#include "../ServiceCPP/BS_thread_pool.hpp"
#include "../ServiceCPP/Service.hpp"
#include "../ServiceCPP/GetPairTypeForClass.hpp"
#include "../ServiceCPP/GetIdAudienceForClass.hpp"
#include "../ServiceCPP/SetBaseScheduleToIndivid.hpp"
#include "../ServiceCPP/Fitness.hpp"

#include <cfloat>
#include <vector>
#include <climits>
#include <algorithm>

using namespace std;
using namespace BS;

//Используеться для сортировки популяций по фитнесу
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

//Класс для создания и управления ГА
class EvolutionAlgorithm
{
protected:
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
    int max_day;
    int max_pair;
    vector<clas> classes;
    vector<audience> audiences;
    base_schedule &bs;
    vector<individ> populations;
    bestIndivid bestIndiv;
    string type_selection;
    bool fitness_scaling;
    string type_crossing;
    int num_k_point;
    string type_mutation;
    double p_mutation_gene;
    string type_initialization;

    // Начальная инициализация расписания
    void Init()
    {
        this->populations = vector<individ>(population_size);
        // Заполнение базового расписания
        for (int k = 0; k < population_size; k++)
        {
            SetBaseScheduleToIndivid(populations[k], bs);
        }
        // Расстановка расписания случайным образом
        if (this->type_initialization == "random") {
            // В начальном варианте у всех индиводов расписание разное но одинаковое количество пар
            for (size_t i = 0; i < this->classes.size(); i++) {
                clas &clas = this->classes[i];
                vector<int> info = GetPairTypeForClass(clas);
                for (size_t j = 0; j < info.size(); j++) {
                    for (int k = 0; k < this->population_size; k++) {
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
                        this->classes[i].schedules[k].push_back(schedule(number_pair, day_week, info[j], id_audience, clas.id));
                    }
                }
            }
        }
        else if (this->type_initialization == "simple_algorithm"){

        }
        // Расстановка ссылок на расписание для индивидов
        for (int index_individ = 0; index_individ < this->population_size; index_individ++) {
            for (size_t index_class = 0; index_class < this->classes.size(); index_class++) {
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

    //Замена занятия у индивида на переданное
    void SwapSchedule(const int &index_class, const int &index_pair, const int &index_individ, const schedule sc){
        int old_id_audience = this->classes[index_class].schedules[index_individ][index_pair].id_audience;
        int new_id_audience = sc.id_audience;
        // Если ид аудитории поменялся, то нужно поменять ссылку на неё
        if (new_id_audience != old_id_audience)
        {
            auto ref = &this->classes[index_class].schedules[index_individ][index_pair];
            auto it = find(this->populations[index_individ].scheduleForAudiences[old_id_audience].begin(), this->populations[index_individ].scheduleForAudiences[old_id_audience].end(), ref);
            this->populations[index_individ].scheduleForAudiences[old_id_audience].erase(it);
            this->populations[index_individ].scheduleForAudiences[new_id_audience].emplace(populations[index_individ].scheduleForAudiences[new_id_audience].begin(), ref);
        }
        // Поменять значение пары
        this->classes[index_class].schedules[index_individ][index_pair] = sc;
    }

    //Обмен занятий между индивидами
    void SwapSchedule(const int &index_class, const int &index_pair, const int &index_individ_1, const int &index_individ2){
        // Если аудитории разные, то менять указатели для каждой аудитории
        if (this->classes[index_class].schedules[index_individ_1][index_pair].id_audience != this->classes[index_class].schedules[index_individ2][index_pair].id_audience)
        {
            // Найти ссылку на занятие для 1 аудитории и удалить
            auto id_aud1 = this->classes[index_class].schedules[index_individ_1][index_pair].id_audience;
            auto ref1 = &this->classes[index_class].schedules[index_individ_1][index_pair];
            auto it1 = find(this->populations[index_individ_1].scheduleForAudiences[id_aud1].begin(),this-> populations[index_individ_1].scheduleForAudiences[id_aud1].end(), ref1);
            this->populations[index_individ_1].scheduleForAudiences[id_aud1].erase(it1);
            // Найти ссылку на занятие для 2 аудитории и удалить
            auto id_aud2 = this->classes[index_class].schedules[index_individ2][index_pair].id_audience;
            auto ref2 = &this->classes[index_class].schedules[index_individ2][index_pair];
            auto it2 = find(this->populations[index_individ2].scheduleForAudiences[id_aud2].begin(), this->populations[index_individ2].scheduleForAudiences[id_aud2].end(), ref2);
            this->populations[index_individ2].scheduleForAudiences[id_aud2].erase(it2);

            // Вставить новые ссылки для аудиторий
            this->populations[index_individ_1].scheduleForAudiences[id_aud2].emplace(this->populations[index_individ_1].scheduleForAudiences[id_aud2].begin(), ref1);
            this->populations[index_individ2].scheduleForAudiences[id_aud1].emplace(this->populations[index_individ2].scheduleForAudiences[id_aud1].begin(), ref2);
        }
        // Поменять параметры занятий между друг другом
        auto sc1 = this->classes[index_class].schedules[index_individ_1][index_pair];
        this->classes[index_class].schedules[index_individ_1][index_pair] = this->classes[index_class].schedules[index_individ2][index_pair];
        this->classes[index_class].schedules[index_individ2][index_pair] = sc1;
    }

    //Фуцнкция сортировки популяции
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
        auto tClassses = vector<vector<vector<schedule>>>(this->classes.size());
        for (size_t i = 0; i < this->classes.size(); i++)
        {
            tClassses[i] = vector<vector<schedule>>(this->classes[i].schedules.size());
            for (size_t j = 0; j < this->classes[i].schedules.size(); j++)
            {
                tClassses[i][j] = vector<schedule>(this->classes[i].schedules[j].size());
                for (size_t k = 0; k < this->classes[i].schedules[j].size(); k++)
                {
                    tClassses[i][j][k] = this->classes[i].schedules[j][k];
                }
            }
        }

        // Переставить занятий у индивидов
        for (size_t index_class = 0; index_class < this->classes.size(); index_class++)
        {
            for (size_t index_individ = 0; index_individ < this->populations.size(); index_individ++)
            {
                for (size_t index_pair = 0; index_pair < this->classes[index_class].schedules[index_individ].size(); index_pair++)
                {
                    SwapSchedule(index_class, index_pair, index_individ, tClassses[index_class][vec_individs[index_individ].index][index_pair]);
                }
            }
        }
        //Перестановка фитнеса у индивидов
        for (size_t j = 0; j < this->populations.size(); j++)
        {
            this->populations[j].fitnessValue = vec_individs[j].fitnessValue;
        }
    }


    //Функция мутации для индивида
    void Mutation(const int &index_individ)
    {
        // Случайное изменение пары для занятия
        if(this->type_mutation == "custom_one_gene"){
            int index_class = GetRndInteger(0, this->classes.size() - 1);
            int index_pair = GetRndInteger(0, this->classes[index_class].schedules[index_individ].size() - 1);
            // если есть рекомендуемоемое время, то пару не менять
            int num_rec = this->classes[index_class].recommended_schedules.size();
            //Если у занятия нету рекомендуемого времени
            if (index_pair >= num_rec)
            {
                int day_week = GetRndInteger(1, max_day);
                int number_pair = GetRndInteger(1, max_pair);
                int new_id_audience = GetIdAudienceForClass(this->classes[index_class], audiences);
                int pair_type = this->classes[index_class].schedules[index_individ][index_pair].pair_type;
                // С шансом 0.5 менять числитель на знаменатель
                if (pair_type < 3 && GetRndDouble() <= 0.5)
                {
                    pair_type = 3 - pair_type;
                }
                auto sc = schedule(number_pair, day_week, pair_type, new_id_audience, this->classes[index_class].id);
                SwapSchedule(index_class,index_pair,index_individ, sc);
            }
        }
        // Изменение всех пар для занятия в зависимости от шанса
        else if (this->type_mutation == "all_genes"){
            for(size_t index_class = 0; index_class < this->classes.size(); index_class++){
                for(int index_pair = 0; index_pair < this->classes[index_class].schedules[index_individ].size(); index_pair++){
                    int num_rec = this->classes[index_class].recommended_schedules.size();
                    // Если у занятия нету рекомендуемого времени
                    if (index_pair >= num_rec){
                        // Если нужно мутировать пару
                        if (GetRndDouble() <= this->p_mutation_gene){
                            int day_week = GetRndInteger(1, max_day);
                            int number_pair = GetRndInteger(1, max_pair);
                            int new_id_audience = GetIdAudienceForClass(this->classes[index_class], this->audiences);
                            int pair_type = this->classes[index_class].schedules[index_individ][index_pair].pair_type;
                            // С шансом 0.5 менять числитель на знаменатель
                            if (pair_type < 3 && GetRndDouble() <= 0.5)
                            {
                                pair_type = 3 - pair_type;
                            }
                            auto sc = schedule(number_pair, day_week, pair_type, new_id_audience, this->classes[index_class].id);
                            SwapSchedule(index_class,index_pair,index_individ, sc);
                        }
                    }
                }
            }
        }
    }

    // Фнукция кроссинга
    void Crossing(const int &index1, const int &index2)
    {
        // Замена случайного занятия между двумя индивидами
        if (this->classes.size() > 1)
        {
            // замена одного гена
            if (this->type_crossing == "custom_one_gene"){
                int index_class = GetRndInteger(0, classes.size() - 1);
                int index_pair = GetRndInteger(0, this->classes[index_class].schedules[index1].size() - 1);
                // Обмен занятий между индивидами
                this->SwapSchedule(index_class,index_pair,index1,index2);
            }
            // k-точечное схрещивание
            else if(this->type_crossing == "k_point"){
                auto points = vector<int>();
                // Промежуток точек от 0 до предпоследней
                int current_max_value = this->classes.size()-2;
                for (auto i = 0; i < this->num_k_point; i++){
                    int r = GetRndInteger(0,current_max_value);
                    current_max_value--;
                    for (size_t j = 0; j < points.size(); j++){
                        if (r >= points[j]){
                            r++;
                        }
                    }
                    points.push_back(r);
                }
                points.push_back(this->classes.size()-1);
                //получили массив точек скрещивания для генов у индивидов
                sort(points.begin(), points.end());
                // Первый промежуток не скрещиваем
                bool need_cross = false;
                for (size_t i = 0; i < points.size() - 1; i++){
                    if (need_cross){
                        for (int index_class = i; index_class <= points[i+1]; index_class++){
                            for (size_t index_pair = 0; index_pair < this->classes[index_class].schedules[index1].size(); index_pair++){
                                this->SwapSchedule(index_class, index_pair, index1, index2);
                            }
                        }
                    }
                    need_cross = !need_cross;
                }
            }
        }
    }

public:
    EvolutionAlgorithm(json data, base_schedule& bs_, thread_pool &worker_pool, const double &Seed = 0) : bs(bs_)
    {
        srand(Seed);
        this->max_day = data["max_day"];
        this->max_pair = data["max_pair"];
        const json evolution_values = data["params"];
        this->population_size = evolution_values["population_size"];
        this->max_generations = evolution_values["max_generations"];
        this->p_crossover = evolution_values["p_crossover"];
        this->p_mutation = evolution_values["p_mutation"];
        this->p_elitism = evolution_values["p_elitism"];
        this->type_selection = evolution_values["type_selection"];
        this->fitness_scaling = evolution_values["fitness_scaling"];
        this->type_crossing = evolution_values["type_crossing"];
        this->num_k_point = evolution_values["num_k_point"];
        this->type_mutation = evolution_values["type_mutation"];
        this->p_mutation_gene = evolution_values["p_mutation_gene"];
        this->type_initialization = evolution_values["type_initialization"];

        const json general_values = data["general_values"];
        this->penaltySameRecSc = general_values["penaltySameRecSc"];
        this->penaltyGrWin = general_values["penaltyGrWin"];
        this->penaltyTeachWin = general_values["penaltyTeachWin"];
        this->penaltySameTimesSc = general_values["penaltySameTimesSc"];
        this->num_elit = population_size * p_elitism;

        //Добавление занятий
        this->classes = vector<clas>();
        for (json &cl : data["classes"])
        {
            classes.push_back(clas(cl, population_size));
        }
        //Добавление аудиторий
        this->audiences = vector<audience>();
        for (json &aud : data["audiences"])
        {
            audience new_aud(aud);
            audiences.push_back(new_aud);
        }
        //Инициализация случайного расписания
        this->Init();

        // Расстановка фитнессов
        this->FitnessLoop(worker_pool);

        //Создание начального лучшего индивида
        this->bestIndiv = bestIndivid();
    }


    //Цикл для подсчета фитнеса
    void FitnessLoop(thread_pool &worker_pool)
    {
        for (int i = 0; i < this->population_size; i++)
        {
            auto &ind = this->populations[i];
            worker_pool.push_task([this, &ind, &i]()
                                  { Fitness(this->classes, ind, i, this->max_day, this->penaltyGrWin, this->penaltyTeachWin, this->penaltySameTimesSc, this->penaltySameRecSc); });
        }
        worker_pool.wait_for_tasks();
    }

    //Цикл для кроссенговера
    void CrossingLoop(thread_pool &worker_pool)
    {
        for (int i = 0; i < this->population_size; i += 2)
        {
            if (GetRndDouble() < this->p_crossover)
            {
                worker_pool.push_task([this, i]()
                                      { this->Crossing(i, i + 1); });
            }
        }

        worker_pool.wait_for_tasks();
    }

    //Цикл мутаций
    void MutationLoop(thread_pool &worker_pool)
    {
        for (int i = 0; i < this->population_size; i++)
        {
            if (GetRndDouble() <= this->p_mutation)
            {
                worker_pool.push_task([this, i]()
                                      { this->Mutation(i); });
            }
        }
        worker_pool.wait_for_tasks();
    }

    //Цикл выборки
    void SelectionLoop(thread_pool &worker_pool)
    {
        this->SortPopulations();
        // Запомнить расписание для его расстоновки по селекции
        auto temp_classes = vector<vector<vector<schedule>>>(classes.size());
        for (size_t i = 0; i < this->classes.size(); i++)
        {
            temp_classes[i] = vector<vector<schedule>>(this->classes[i].schedules.size());
            for (size_t j = 0; j < this->classes[i].schedules.size(); j++)
            {
                temp_classes[i][j] = vector<schedule>(this->classes[i].schedules[j].size());
                for (size_t k = 0; k < this->classes[i].schedules[j].size(); k++)
                {
                    temp_classes[i][j][k] = this->classes[i].schedules[j][k];
                }
            }
        }
        // маштабирование приспоосбления от 30 до 80
        if(this->fitness_scaling){
            double fitness_max = DBL_MIN;
            double fitness_min = DBL_MAX;
            for (auto &ind : this->populations){
                if (ind.fitnessValue.fitnessValue >= fitness_max){
                    fitness_max = ind.fitnessValue.fitnessValue;
                }
                if (ind.fitnessValue.fitnessValue < fitness_min){
                    fitness_min = ind.fitnessValue.fitnessValue;
                }
            }
            double fitness_scale_min = 30;
            double fitness_scale_max = 80;
            double a;
            if(fitness_min == fitness_max){
                a = (fitness_scale_min - fitness_scale_max);
            }
            else{
                a = (fitness_scale_min - fitness_scale_max) / (fitness_min - fitness_max);
            }
            double b = fitness_scale_min - (a * fitness_min);
            for (auto &ind : this->populations){
                ind.fitnessValue.fitnessValue = a * ind.fitnessValue.fitnessValue + b;
            }
        }
        // Добавление элитных особей
        auto individ_indexes = vector<int>();
        for(auto i =0; i< num_elit; i++){
            individ_indexes.push_back(i);
        }
        // Тип выборки индивидов
        if (this->type_selection == "roulette"){
            double sum_fitness = 0;
            for (auto &ind : this->populations){
                sum_fitness += ind.fitnessValue.fitnessValue;
            }
            auto part_individs = vector<double>(this->population_size+1);
            part_individs[0] = 0;
            double sum_parts = 0;
            //Массив с долями победы определонного индивида
            for (auto i = 0; i < this->population_size; i++){
                sum_parts += 1-(this->populations[i].fitnessValue.fitnessValue / sum_fitness);
                part_individs[i+1] = sum_parts;
            }
            for (auto i = 0; i < this->population_size - this->num_elit; i++){
                int winIndex = -1;
                double r = GetRndDouble(0, part_individs[this->population_size]);
                // бинарный поиск для выбора индивида
                int index_left = 0;
                int index_right = this->population_size;
                while(winIndex == -1){
                    int mid = floor((index_left + index_right) / 2);
                    if (r >= part_individs[mid]){
                        index_left = mid;
                    }
                    else if (r <= part_individs[mid]){
                        index_right = mid;
                    }
                    if(r >= part_individs[index_left] && r <= part_individs[index_left+1]){
                        winIndex = index_left;
                    }
                }
                individ_indexes.push_back(winIndex);
            }
        }
        else if (this->type_selection == "ranging"){
            double sum_fitness = (this->population_size * (this->population_size + 1) / 2);
            auto part_individs = vector<double>(this->population_size+1);
            part_individs[0] = 0;
            double sum_parts = 0;
            for (auto i = 0; i < this->population_size; i++){
                sum_parts += ((this->population_size - i) / sum_fitness);
                part_individs[i + 1] = sum_parts;
            }
            for (int i = 0; i < this->population_size - this->num_elit; i++){
                int winIndex = -1;
                auto r = GetRndDouble();
                // бинарный поиск для выбора индивида
                int index_left = 0;
                int index_right = this->population_size;
                while(winIndex == -1){
                    int mid = floor((index_left + index_right) / 2);
                    if (r >= part_individs[mid]){
                        index_left = mid;
                    }
                    else if (r <= part_individs[mid]){
                        index_right = mid;
                    }
                    if(r >= part_individs[index_left] && r <= part_individs[index_left+1]){
                        winIndex = index_left;
                    }
                }
                individ_indexes.push_back(winIndex);
            }
        }
        else if (this->type_selection == "tournament"){
            for (int i = 0; i < this->population_size - this->num_elit; i++)
            {
                // по умолчанию туринр
                int i1 = 0;
                int i2 = 0;
                int i3 = 0;
                while (i1 == i2 || i2 == i3 || i1 == i3)
                {
                    i1 = GetRndInteger(0, this->populations.size() - 1);
                    i2 = GetRndInteger(0, this->populations.size() - 1);
                    i3 = GetRndInteger(0, this->populations.size() - 1);
                }
                int winIndex;
                if (this->populations[i1].fitnessValue.fitnessValue < this->populations[i2].fitnessValue.fitnessValue && this->populations[i1].fitnessValue.fitnessValue < this->populations[i3].fitnessValue.fitnessValue)
                    winIndex = i1;
                else if (this->populations[i2].fitnessValue.fitnessValue < this->populations[i1].fitnessValue.fitnessValue && this->populations[i2].fitnessValue.fitnessValue < this->populations[i3].fitnessValue.fitnessValue)
                    winIndex = i2;
                else
                    winIndex = i3;
                individ_indexes.push_back(winIndex);
            }

        }

        //Расстановка расписания
        for (size_t index_individ = 0; index_individ < individ_indexes.size(); index_individ++) {
            // остается поменять значение занятий на новые
            int new_index = individ_indexes[index_individ];
            for (size_t index_class = 0; index_class < classes.size(); index_class++) {
                for (size_t index_pair = 0; index_pair < this->classes[index_class].schedules[index_individ].size(); index_pair++) {
                    auto sc = temp_classes[index_class][new_index][index_pair];
                    SwapSchedule(index_class,index_pair,index_individ,sc);
                }
            }
        }
        if (this->fitness_scaling){
            this->FitnessLoop(worker_pool);
        }
    }

    //Подсчет среднего значение фитнеса по популяции
    double MeanFitnessValue()
    {
        double sum = 0;
        for (size_t i = 0; i < this->populations.size(); i++)
        {
            sum += this->populations[i].fitnessValue.fitnessValue;
        }
        return sum / this->populations.size();
    }

    //Получить лучшего индивида
    bestIndivid GetBestIndivid()
    {
        int best_index = -1;
        auto minFitness = this->bestIndiv.fitnessValue.fitnessValue;
        for (size_t i = 0; i < this->populations.size(); i++){
            if (this->populations[i].fitnessValue.fitnessValue <= minFitness){
                minFitness = this->populations[i].fitnessValue.fitnessValue;
                best_index = i;
            }
        }
        if (best_index != -1){
            this->bestIndiv.arr_schedule.clear();
            this->bestIndiv.fitnessValue = this->populations[best_index].fitnessValue;
            for (auto &cl : this->classes)
            {
                for (auto &sc : cl.schedules[best_index])
                {
                    this->bestIndiv.arr_schedule.push_back(schedule(sc.number_pair, sc.day_week, sc.pair_type, sc.id_audience, sc.id_class));
                }
            }
        }
        return this->bestIndiv;
    }

};

#endif
