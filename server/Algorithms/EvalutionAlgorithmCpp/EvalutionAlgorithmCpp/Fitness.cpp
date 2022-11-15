#include "Fitness.h"
#include <map>
#include <iostream>
#include <vector>
#include "SortSchedule.h"
using namespace std;
map<string, double> FitnessByGroups(map <int, vector<schedule>> &scheduleForGroups,const int &max_day, const double &penaltySameTimesSc, const double &penaltyGrWin);
map<string, double> FitnessByTeachers(map <int, vector<schedule>> &scheduleForTeachers,const int &max_day,const double &penaltySameTimesSc,const double &penaltyTeachWin);
map<string, double> FitnessByAudiences(map <int, vector<schedule>> &scheduleForAudiences,const double &penaltySameTimesSc);
double FitnessWindows(vector<schedule > i_schedule,const int &max_day,const double &penaltyWin);
double FitnessSameTimes(vector<schedule> i_schedule,const double &penaltySameTimesSc);
double FitnessSameSchedules(map <int, vector<schedule>>&i_schedule, const vector < recommended_schedule> &recommedned_schedules,const double &penaltySameRecSc);

void Fitness(individ& i_schedule, const vector <recommended_schedule>& recommended_schedules, const int& max_day, const double& penaltySameRecSc, const double& penaltyGrWin, const double& penaltySameTimesSc, const double& penaltyTeachWin){
    bool sortedGroups = false,sortedTeachers= false,sortedAudiences=false;
    auto itGr=i_schedule.scheduleForGroups.begin(),itTeach= i_schedule.scheduleForTeachers.begin(),itAud= i_schedule.scheduleForAudiences.begin();
    while(!sortedGroups || !sortedTeachers || !sortedAudiences){
        if(itGr!= i_schedule.scheduleForGroups.end()){
            SortSchedule(itGr->second);
            ++itGr;
        }
        else
            sortedGroups=true;
        if(itTeach!= i_schedule.scheduleForTeachers.end()){
            SortSchedule(itTeach->second);
            ++itTeach;
        }
        else
            sortedTeachers=true;
        if(itAud!= i_schedule.scheduleForAudiences.end()){
            SortSchedule(itAud->second);
            ++itAud;
        }
        else
            sortedAudiences=true;

    }
    map<string, double> fitnessGr=FitnessByGroups(i_schedule.scheduleForGroups,max_day,penaltySameTimesSc,penaltyGrWin);
    map<string, double> fitnessTeach = FitnessByTeachers(i_schedule.scheduleForTeachers,max_day,penaltySameTimesSc,penaltyTeachWin);
    map<string, double> empty = { {"fitnessValue",0},{"fitnessSameTimesSc",0}};
    map<string, double> fitnessAud = penaltySameTimesSc == 0 ? empty : FitnessByAudiences(i_schedule.scheduleForAudiences,penaltySameTimesSc);
    double fitnessSameRecSc = FitnessSameSchedules(i_schedule.scheduleForAudiences,recommended_schedules,penaltySameRecSc);

    double fitnessValue = fitnessGr["fitnessValue"] + fitnessTeach["fitnessValue"] + fitnessAud["fitnessValue"] + fitnessSameRecSc;
    i_schedule.fitnessValue = fitness(fitnessValue, fitnessGr, fitnessTeach, fitnessAud, fitnessSameRecSc);
}


map<string, double> FitnessByGroups(map <int, vector<schedule>>& scheduleForGroups, const int& max_day, const double& penaltySameTimesSc, const double& penaltyGrWin){
    double fitnessGrWin = 0;
    double fitnessSameTimesSc = 0;
    auto itGr=scheduleForGroups.begin();
    while(itGr!=scheduleForGroups.end()){
        fitnessGrWin += penaltyGrWin == 0 ? 0 : FitnessWindows(itGr->second,max_day,penaltyGrWin);
        fitnessSameTimesSc += penaltySameTimesSc == 0 ? 0 : FitnessSameTimes(itGr->second,penaltySameTimesSc);
        ++itGr;
    }
    double fitnessValue = fitnessGrWin + fitnessSameTimesSc;
    map<string, double> fitnessV;
    fitnessV["fitnessValue"] = fitnessValue;
    fitnessV["fitnessGrWin"] = fitnessGrWin;
    fitnessV["fitnessSameTimesSc"] = fitnessSameTimesSc;
    return fitnessV;
}
map<string, double> FitnessByTeachers(map <int, vector<schedule>>& scheduleForTeachers, const int& max_day, const double& penaltySameTimesSc, const double& penaltyTeachWin){
    double fitnessTeachWin = 0;
    double fitnessSameTimesSc = 0;
    auto itTeach=scheduleForTeachers.begin();
    while(itTeach!=scheduleForTeachers.end()){
        fitnessTeachWin += penaltyTeachWin == 0 ? 0 : FitnessWindows(itTeach->second,max_day,penaltyTeachWin);
        fitnessSameTimesSc += penaltySameTimesSc == 0 ? 0 : FitnessSameTimes(itTeach->second,penaltySameTimesSc);
        ++itTeach;
    }
    double fitnessValue = fitnessTeachWin + fitnessSameTimesSc;
    map<string, double> fitnessV;
    fitnessV["fitnessValue"] = fitnessValue;
    fitnessV["fitnessTeachWin"] = fitnessTeachWin;
    fitnessV["fitnessSameTimesSc"] = fitnessSameTimesSc;
    return fitnessV;
}

map<string, double> FitnessByAudiences(map <int, vector<schedule>>&scheduleForAudiences, const double& penaltySameTimesSc){
    double fitnessSameTimesSc = 0;
    auto itAud=scheduleForAudiences.begin();
    while(itAud!=scheduleForAudiences.end()){
        fitnessSameTimesSc += penaltySameTimesSc == 0 ? 0 : FitnessSameTimes(itAud->second,penaltySameTimesSc);
        ++itAud;
    }
    double fitnessValue = fitnessSameTimesSc;
    map<string, double> fitnessV;
    fitnessV["fitnessValue"] = fitnessValue;
    fitnessV["fitnessSameTimesSc"] = fitnessSameTimesSc;
    return fitnessV;
}


double FitnessWindows(vector<schedule > i_schedule, const int& max_day, const double& penaltyWin){
    double fitnessWindows = 0;
    for(int current_day = 1; current_day <=max_day;current_day++){

        vector<schedule> schedule_top;
        vector<schedule> schedule_bot;
        for(schedule &clas: i_schedule){
            if(clas.day_week == current_day){
                switch(clas.pair_type){
                    case 1: schedule_top.push_back(clas);
                    break;
                    case 2: schedule_bot.push_back(clas);
                    break;
                    case 3: schedule_bot.push_back(clas);
                            schedule_top.push_back(clas);
                            break;
                }
            }
        }

        vector<vector<schedule>> arr;

        if(!schedule_top.empty())
        for(size_t i = 0; i<schedule_top.size()-1;i++){
            int diff = schedule_top[i+1].number_pair-schedule_top[i].number_pair -1;
            if(diff>1){
                fitnessWindows+=diff*penaltyWin;
                if(schedule_top[i+1].pair_type==3 && schedule_top[i].pair_type==3){
                    vector<schedule> arrT;
                    arrT.push_back(schedule_top[i]);
                    arrT.push_back(schedule_top[i+1]);
                    arr.push_back(arrT);
                }

            }

        }
        if (!schedule_bot.empty())
        for(size_t i = 0; i<schedule_bot.size()-1;i++){
            int diff = schedule_bot[i+1].number_pair-schedule_bot[i].number_pair-1;
            if(diff>1){
                if(schedule_bot[i+1].pair_type==3 && schedule_bot[i].pair_type ==3){
                    bool flag = false;
                    for (vector<schedule> arrJ : arr) {
                        if (arrJ[0].compare(schedule_bot[i]) && arrJ[1].compare(schedule_bot[i + 1])) {
                            continue;
                        }
                    }
                }

                fitnessWindows+=diff*penaltyWin;
            }
        }
    }
    return fitnessWindows;
}

double FitnessSameSchedules(map <int, vector<schedule>>& i_schedule, const vector < recommended_schedule>& recommedned_schedules, const double& penaltySameRecSc){
    double fitnessSameRecSc = 0;
     auto itSc=i_schedule.begin();
     while(itSc!=i_schedule.end()){
         for(const schedule &clas : itSc->second){
             vector<recommended_schedule> recSc;
             for(recommended_schedule rs: recommedned_schedules){
                 if(rs.id_class ==  clas.id_class)
                     recSc.push_back(rs);
             }
             if(!recSc.empty()){
                 vector<recommended_schedule> isSame;
                 for(recommended_schedule rs: recSc){
                     if(rs.day_week == clas.day_week && rs.number_pair == clas.number_pair)
                         isSame.push_back(rs);
                 }
                 if(!isSame.empty())
                     fitnessSameRecSc+=penaltySameRecSc;
             }
         }


         ++itSc;
    }
     return fitnessSameRecSc;

}

double FitnessSameTimes(vector<schedule > i_schedule, const double& penaltySameTimesSc){
    double fitnessSameTimes = 0;
    schedule lastTop,lastBot,lastTotal;
    int cur_day = -1;
    for(size_t i=-1;i<i_schedule.size()-1;i++){
        if(i_schedule[i+1].day_week != cur_day){
            cur_day = i_schedule[i+1].day_week;
            lastTop = schedule();
            lastBot = schedule();
            lastTotal = schedule();
            continue;
        }
        switch (i_schedule[i].pair_type)
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
        if(i_schedule[i+1].number_pair == i_schedule[i].number_pair){
            if(i_schedule[i+1].pair_type == 1 && (lastTop.isNullOrEmpty() ? false : lastTop.number_pair ==i_schedule[i+1].number_pair || lastTotal.isNullOrEmpty() ? false : lastTotal.number_pair ==i_schedule[i+1].number_pair)){
                fitnessSameTimes+=penaltySameTimesSc;
                continue;
            }
            if(i_schedule[i+1].pair_type == 2 && (lastBot.isNullOrEmpty() ? false : lastBot.number_pair ==i_schedule[i+1].number_pair || lastTotal.isNullOrEmpty() ? false : lastTotal.number_pair ==i_schedule[i+1].number_pair)){
                fitnessSameTimes+=penaltySameTimesSc;
                continue;
            }
            if(i_schedule[i+1].pair_type == 3 && (lastTop.isNullOrEmpty() ? false : lastTop.number_pair ==i_schedule[i+1].number_pair || lastBot.isNullOrEmpty() ? false :lastBot.number_pair ==i_schedule[i+1].number_pair || lastTotal.isNullOrEmpty() ? false : lastTotal.number_pair ==i_schedule[i+1].number_pair)){
                fitnessSameTimes+=penaltySameTimesSc;
                continue;
            }
        }
    }
    return fitnessSameTimes;
}



