#ifndef EVOLUTIONALGORITHM_HPP
#define EVOLUTIONALGORITHM_HPP

#include "../ServiceCPP/TypeDefs.hpp"
#include "../ServiceCPP/BS_thread_pool.hpp"
#include "../ServiceCPP/GetRnd.hpp"
#include "../ServiceCPP/Service.hpp"

#include <cfloat>
#include <vector>
#include <climits>
#include <algorithm>
#include <fstream>

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
        if (fitnessValue.fitnessValue < b.fitnessValue.fitnessValue)
            return true;
        else
            return false;
    }
};

//Класс для создания и управления ГА
class EvolutionAlgorithm : public Service
{
protected:
    double p_crossover;
    double p_mutation;
    double p_elitism;
    int num_elit;
    string type_selection;
    string type_crossing;
    int num_k_point;

    //Фуцнкция сортировки популяции
    vector<Popul> SortPopulations()
    {
        // Получить новые индексы популяций
        auto vec_individs = vector<Popul>(populations.size());
        for (size_t i = 0; i < populations.size(); i++)
        {
            vec_individs[i] = Popul(populations[i].fitnessValue, i);
        }
        sort(vec_individs.begin(), vec_individs.end());
        return vec_individs;
    }

    // Фнукция кроссинга
    void Crossing(int index1, int index2)
    {
        // Замена случайного занятия между двумя индивидами
        if (classes.size() > 1)
        {
            // замена одного гена
            if (type_crossing == "custom_one_gene"){
                int index_class = GetRndInteger(0, classes.size() - 1);
                // Обмен занятий между индивидами
                SwapSchedule(index_class, index1, index2);
            }
            // k-точечное схрещивание
            else if(type_crossing == "k_point"){
                auto points = vector<int>();
                // Промежуток точек от 0 до предпоследней
                int current_max_value = classes.size()-2;
                for (auto i = 0; i < num_k_point; i++){
                    int r = GetRndInteger(0,current_max_value);
                    current_max_value--;
                    for (size_t j = 0; j < points.size(); j++){
                        if (r >= points[j]){
                            r++;
                        }
                    }
                    points.push_back(r);
                }
                points.push_back(classes.size()-1);
                //получили массив точек скрещивания для генов у индивидов
                sort(points.begin(), points.end());
                // Первый промежуток не скрещиваем
                bool need_cross = false;
                for (size_t i = 0; i < points.size() - 1; i++){
                    if (need_cross){
                        for (int index_class = i; index_class <= points[i+1]; index_class++){
                            SwapSchedule(index_class, index1, index2);
                        }
                    }
                    need_cross = !need_cross;
                }
            }
        }
    }

public:
    EvolutionAlgorithm(){}
    EvolutionAlgorithm(json data, json data_SA = NULL){
        json evolution_values = data["params"];
        InitServiceWithInitAndMut(data, evolution_values["population_size"]);

        p_crossover = evolution_values["p_crossover"];
        p_mutation = evolution_values["p_mutation"];
        p_elitism = evolution_values["p_elitism"];
        type_selection = evolution_values["type_selection"];
        type_crossing = evolution_values["type_crossing"];
        num_k_point = evolution_values["num_k_point"];
        num_elit = population_size * p_elitism;

        InitClasses(data_SA);
        InitPopulations();
    }

    //Цикл для подсчета фитнеса
    void FitnessLoop(thread_pool &worker_pool)
    {
        for (int index_individ = 0; index_individ < population_size; index_individ++)
        {
            worker_pool.push_task([this, index_individ]()
                                  { Fitness(index_individ); });
        }
        worker_pool.wait_for_tasks();
    }

    //Цикл для кроссенговера
    void CrossingLoop(thread_pool &worker_pool)
    {
        for (int index_individ = 0; index_individ < population_size; index_individ += 2)
        {
            if (GetRndDouble() < p_crossover)
            {
                worker_pool.push_task([this, index_individ]()
                                      { Crossing(index_individ, index_individ + 1); });
            }
        }
        worker_pool.wait_for_tasks();
    }

    //Цикл мутаций
    void MutationLoop(thread_pool &worker_pool)
    {
        for (int index_individ = 0; index_individ < population_size; index_individ++)
        {
            if (GetRndDouble() <= p_mutation)
            {
                worker_pool.push_task([this, index_individ]()
                                      { Mutation(index_individ); });
            }
        }
        worker_pool.wait_for_tasks();
    }

    //Цикл выборки
    void SelectionLoop(thread_pool &worker_pool)
    {
        auto vec_individs = SortPopulations();
        // Запомнить расписание для его расстановки по селекции
        auto temp_classes = vector<vector<vector<schedule>>>(classes.size());
        for (size_t i = 0; i < classes.size(); i++) {
            temp_classes[i] = vector<vector<schedule>>(classes[i].schedules.size());
            for (size_t j = 0; j < classes[i].schedules.size(); j++) {
                temp_classes[i][j] = vector<schedule>(classes[i].schedules[j].size());
                for (size_t k = 0; k < classes[i].schedules[j].size(); k++) {
                    temp_classes[i][j][k] = classes[i].schedules[j][k];
                }
            }
        }
        // Добавление элитных особей
        auto individ_indexes = vector<int>();
        for(auto i =0; i< num_elit; i++){
            individ_indexes.push_back(vec_individs[i].index);
        }
        // Тип выборки индивидов
        if (type_selection == "roulette"){
            double sum_fitness = 0;
            for (auto &ind : vec_individs){
                sum_fitness += ind.fitnessValue.fitnessValue;
            }
            auto part_individs = vector<double>(population_size+1);
            part_individs[0] = 0;
            double sum_parts = 0;
            //Массив с долями победы определонного индивида
            for (auto i = 0; i < population_size; i++){
                sum_parts += 1-(vec_individs[i].fitnessValue.fitnessValue / sum_fitness);
                part_individs[i+1] = sum_parts;
            }
            for (auto i = 0; i < population_size - num_elit; i++){
                int winIndex = -1;
                double r = GetRndDouble(0, part_individs[population_size]);
                // бинарный поиск для выбора индивида
                int index_left = 0;
                int index_right = population_size;
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
                individ_indexes.push_back(vec_individs[winIndex].index);
            }
        }
        else if (type_selection == "ranging"){
            double sum_fitness = (population_size * (population_size + 1) / 2);
            auto part_individs = vector<double>(population_size+1);
            part_individs[0] = 0;
            double sum_parts = 0;
            for (auto i = 0; i < population_size; i++){
                sum_parts += ((population_size - i) / sum_fitness);
                part_individs[i + 1] = sum_parts;
            }
            for (int i = 0; i < population_size - num_elit; i++){
                int winIndex = -1;
                auto r = GetRndDouble();
                // бинарный поиск для выбора индивида
                int index_left = 0;
                int index_right = population_size;
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
                individ_indexes.push_back(vec_individs[winIndex].index);
            }
        }
        else if (type_selection == "tournament"){
            for (int i = 0; i < population_size - num_elit; i++) {
                // по умолчанию туринр
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
                if (populations[i1].fitnessValue.fitnessValue < populations[i2].fitnessValue.fitnessValue && populations[i1].fitnessValue.fitnessValue <  populations[i3].fitnessValue.fitnessValue)
                    winIndex = i1;
                else if (populations[i2].fitnessValue.fitnessValue < populations[i1].fitnessValue.fitnessValue && populations[i2].fitnessValue.fitnessValue < populations[i3].fitnessValue.fitnessValue)
                    winIndex = i2;
                else
                    winIndex = i3;
                individ_indexes.push_back(vec_individs[winIndex].index);
            }
        }

        //Расстановка расписания
        for (int index_individ = 0; index_individ < individ_indexes.size(); index_individ++) {
            // остается поменять значение занятий на новые
            int new_index = individ_indexes[index_individ];
            for (int index_class = 0; index_class < classes.size(); index_class++) {
                SwapSchedule(index_class, index_individ, temp_classes[index_class][new_index]);
            }
        }
        FitnessLoop(worker_pool);
    }
};

#endif
