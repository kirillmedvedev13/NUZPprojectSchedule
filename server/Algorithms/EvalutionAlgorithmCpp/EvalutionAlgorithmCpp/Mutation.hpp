#ifndef MUTATION_H
#define MUTATION_H

#include "TypeDefs.h"
#include "GetRndDouble.hpp"
#include "GetPairTypeForClass.hpp"
#include "GetIdAudienceForClass.hpp"
#include "GetRndInteger.hpp"

void Mutation(individ* mutant,const int &index, const double& p_genes, const int& max_day, const int& max_pair, vector<audience>& audiences, vector<clas>& classes)
{
    for (auto &cl : classes){
        if (GetRndDouble() <= p_genes){
            for(size_t i =0; i < cl.schedules[index].size(); i++){
                // С шансом 50 = будет менятся каждая пара в занятие
                if(GetRndDouble() <= 0.5){
                    // если нету рекомендуемое время, то пару не менять
                    if(i > cl.recommended_schedules.size()-1){
                        int day_week = GetRndInteger(1, max_day);
                        int number_pair = GetRndInteger(1,max_pair);
                        int new_id_audience = GetIdAudienceForClass(cl, audiences);
                        int old_id_audience = cl.schedules[index][i].id_audience;
                        int pair_type = cl.schedules[index][i].pair_type;
                        // С шансом 50 менять числитель на знаменатель
                        if(pair_type < 3 && GetRndDouble() <= 0.5){
                            pair_type = 3 - pair_type;
                        }
                        cl.schedules[index][i].day_week = day_week;
                        cl.schedules[index][i].number_pair = number_pair;
                        cl.schedules[index][i].pair_type = pair_type;
                        // Замена ссылки для аудитории
                        if (old_id_audience != new_id_audience){
                            cl.schedules[index][i].id_audience = new_id_audience;
                            auto ref = &cl.schedules[index][i];
                            auto it = find(mutant->scheduleForAudiences[old_id_audience].begin(), mutant->scheduleForAudiences[old_id_audience].end(), ref);
                            mutant->scheduleForAudiences.at(old_id_audience).erase(it);
                            mutant->scheduleForAudiences[new_id_audience].emplace(mutant->scheduleForAudiences[new_id_audience].begin(), ref);
                        }
                    }
                }
            }
        }
    }
}

#endif
