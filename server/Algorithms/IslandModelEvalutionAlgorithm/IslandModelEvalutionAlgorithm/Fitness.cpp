#include "EvalutionAlgorithm.h"

double FitnessWindows(vector<schedule*> &i_schedule,const int &max_day,const double &penaltyWin);
double FitnessSameTimes(vector<schedule*> &i_schedule,const double &penaltySameTimesSc);
double FitnessRecommendSchedules(const vector<recommended_schedule> &rs, const vector<schedule> &sc, const double &penaltySameRecSc);

void EvalutionAlgorithm::Fitness(individ &i_schedule, const int &index){
    for (auto &sc_gr : i_schedule.scheduleForGroups){
        SortSchedule(sc_gr.second);
    }
    for (auto &sc_teach : i_schedule.scheduleForGroups){
        SortSchedule(sc_teach.second);
    }
    for (auto &sc_aud : i_schedule.scheduleForGroups){
        SortSchedule(sc_aud.second);
    }
    double fitnessValue = 0;
    double fitnessGrWin = 0;
    double fitnessSameTimeGr = 0;
    double fitnessTeachWin = 0;
    double fitnessSameTimeTeach = 0;
    double fitnessSameTimeAud = 0;
    double fitnessRecSc = 0;
    for (auto &sc_gr : i_schedule.scheduleForGroups){
        fitnessGrWin += FitnessWindows(sc_gr.second, max_day, penaltyGrWin);
        fitnessSameTimeGr += FitnessSameTimes(sc_gr.second, penaltySameTimesSc);
    }
    for (auto &sc_teach : i_schedule.scheduleForTeachers){
        fitnessTeachWin += FitnessWindows(sc_teach.second, max_day, penaltyTeachWin);
        fitnessSameTimeTeach += FitnessSameTimes(sc_teach.second, penaltySameTimesSc);
    }
    for (auto &sc_aud : i_schedule.scheduleForAudiences){
        fitnessSameTimeAud += FitnessSameTimes(sc_aud.second, penaltySameTimesSc);
    }
    for (auto &cl : classes){
        if (cl.recommended_schedules.size() > 0){
            fitnessRecSc += FitnessRecommendSchedules(cl.recommended_schedules, cl.schedules[index], penaltySameRecSc);
        }
    }
    fitnessValue = fitnessGrWin + fitnessSameTimeGr + fitnessTeachWin + fitnessSameTimeTeach + fitnessSameTimeAud + fitnessRecSc;
    i_schedule.fitnessValue = fitness(fitnessValue,fitnessGrWin,fitnessSameTimeGr,fitnessTeachWin,fitnessSameTimeTeach,fitnessSameTimeAud, fitnessRecSc);
}



double FitnessWindows(vector<schedule*> &i_schedule, const int& max_day, const double& penaltyWin){
    double fitnessWindows = 0;
    for(int current_day = 1; current_day <=max_day;current_day++){
        auto schedule_top = vector<schedule*>();
        auto schedule_bot = vector<schedule*>();
        copy_if(i_schedule.begin(), i_schedule.end(), back_inserter(schedule_top), [&current_day](schedule *p){
            return (p->day_week == current_day && (p->pair_type == 1 || p->pair_type == 3));
        });
        copy_if(i_schedule.begin(), i_schedule.end(), back_inserter(schedule_bot), [&current_day](schedule *p){
            return (p->day_week == current_day && (p->pair_type == 2 || p->pair_type == 3));
        });
        auto array = vector<pair<schedule*,schedule*>>();
        // Числитель и Общие
        int s = schedule_top.size()- 1;
        for (int i =0; i < s; i++){
            auto diff = (schedule_top[i+1]->number_pair - schedule_top[i]->number_pair);
            if(diff > 1){
                fitnessWindows += diff * penaltyWin;
            }
            // Запомнить окно между общими парами что бы в знаменателе их не повторять
            if (schedule_top[i + 1]->pair_type == 3 && schedule_top[i]->pair_type == 3) {
                array.push_back(make_pair(schedule_top[i], schedule_top[i + 1]));
            }
        }
        // Знаменатель
        s = schedule_bot.size()-1;
        for (int i =0; i < s; i++){
            auto diff = (schedule_bot[i+1]->number_pair - schedule_bot[i]->number_pair);
            if(diff > 1){
                if(schedule_bot[i + 1]->pair_type == 3 && schedule_bot[i]->pair_type == 3){
                    auto res = find_if(array.begin(), array.end(), [&i, &schedule_bot](const pair<schedule*,schedule*> &p){
                        return (p.first == schedule_bot[i] && p.second == schedule_bot[i+1]);
                    });
                    if(res != array.end())
                        continue;
                }
                fitnessWindows += (schedule_bot[i + 1]->number_pair - schedule_bot[i]->number_pair - 1) * penaltyWin;
            }
        }
    }
    return fitnessWindows;
}

double FitnessRecommendSchedules(const vector<recommended_schedule> &rs, const vector<schedule> &sc, const double &penaltySameRecSc){
    double fitnessSameRecSc = 0;
    for (size_t i =0; i < sc.size(); i++){
        if(sc[i].day_week != rs[i].day_week || sc[i].number_pair != rs[i].number_pair){
            fitnessSameRecSc += penaltySameRecSc;
        }
    }
    return fitnessSameRecSc;

}

double FitnessSameTimes(vector<schedule*> &i_schedule, const double& penaltySameTimesSc){
    double fitnessSameTimes = 0;
    schedule* lastTop=nullptr;
    schedule* lastBot=nullptr;
    schedule* lastTotal=nullptr;
    int cur_day = -1;
    int s = i_schedule.size()-1;
    for(int i=-1; i < s;i++){
        if(i_schedule[i+1]->day_week != cur_day){
            cur_day = i_schedule[i+1]->day_week;
            lastTop=nullptr;
            lastBot=nullptr;
            lastTotal=nullptr;
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
        if(i_schedule[i+1]->number_pair == i_schedule[i]->number_pair){
            if(i_schedule[i+1]->pair_type == 1){
                auto top = lastTop!=nullptr ? (lastTop->number_pair == i_schedule[i+1]->number_pair) : false;
                auto tot = lastTotal!=nullptr ? (lastTotal->number_pair == i_schedule[i+1]->number_pair) : false;
                if (top || tot){
                    fitnessSameTimes+=penaltySameTimesSc;
                    continue;
                }
            }
            if(i_schedule[i+1]->pair_type == 2){
                auto bot = lastBot!=nullptr ? (lastBot->number_pair == i_schedule[i+1]->number_pair) : false;
                auto tot = lastTotal!=nullptr ? (lastTotal->number_pair == i_schedule[i+1]->number_pair) : false;
                if (bot || tot){
                    fitnessSameTimes+=penaltySameTimesSc;
                    continue;
                }
            }
            if(i_schedule[i+1]->pair_type == 3){
                auto bot = lastBot!=nullptr ? (lastBot->number_pair == i_schedule[i+1]->number_pair) : false;
                auto top = lastTop!=nullptr ? (lastTop->number_pair == i_schedule[i+1]->number_pair) : false;
                auto tot = lastTotal!=nullptr ? (lastTotal->number_pair == i_schedule[i+1]->number_pair) : false;
                if (bot || top || tot){
                    fitnessSameTimes+=penaltySameTimesSc;
                    continue;
                }
            }
        }
    }
    return fitnessSameTimes;
}

