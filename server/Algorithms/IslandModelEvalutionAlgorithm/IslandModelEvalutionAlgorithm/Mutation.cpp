#include "EvalutionAlgorithm.h"

void EvalutionAlgorithm::Mutation(const int &index)
{
    // Случайное изменение пары для занятия
    int index_class = GetRndInteger(0,classes.size()-1);
    int index_pair = GetRndInteger(0,classes[index_class].schedules[index].size()-1);
    // если есть рекомендуемоемое время, то пару не менять
    int num_rec = classes[index_class].recommended_schedules.size();
    if(index_pair >= num_rec){
        int day_week = GetRndInteger(1, max_day);
        int number_pair = GetRndInteger(1,max_pair);
        int new_id_audience = GetIdAudienceForClass(classes[index_class]);
        int old_id_audience = classes[index_class].schedules[index][index_pair].id_audience;
        int pair_type = classes[index_class].schedules[index][index_pair].pair_type;
        // С шансом 0.5 менять числитель на знаменатель
        if(pair_type < 3 && GetRndDouble() <= 0.5){
            pair_type = 3 - pair_type;
        }
        classes[index_class].schedules[index][index_pair].day_week = day_week;
        classes[index_class].schedules[index][index_pair].number_pair = number_pair;
        classes[index_class].schedules[index][index_pair].pair_type = pair_type;
        // Замена ссылки для аудитории если аудитория поменялась
        if (old_id_audience != new_id_audience){
            classes[index_class].schedules[index][index_pair].id_audience = new_id_audience;
            auto ref = &classes[index_class].schedules[index][index_pair];
            auto it = find(populations[index].scheduleForAudiences[old_id_audience].begin(), populations[index].scheduleForAudiences[old_id_audience].end(), ref);
            populations[index].scheduleForAudiences[old_id_audience].erase(it);
            populations[index].scheduleForAudiences[new_id_audience].emplace(populations[index].scheduleForAudiences[new_id_audience].begin(), ref);

        }
    }
}
