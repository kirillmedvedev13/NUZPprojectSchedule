#include "EvalutionAlgorithm.h"

void EvalutionAlgorithm::Selection(){

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
    for (size_t i =0; i < classes.size(); i++){
        temp_classes[i] = vector<vector<schedule>>(classes[i].schedules.size());
        for (size_t j = 0; j < classes[i].schedules.size(); j++){
            temp_classes[i][j] = vector<schedule>(classes[i].schedules[j].size());
            for(size_t k = 0; k < classes[i].schedules[j].size(); k++){
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
