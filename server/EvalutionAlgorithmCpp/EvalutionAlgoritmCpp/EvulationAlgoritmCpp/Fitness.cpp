#include "Fitness.h"
#include <map>
#include <iostream>
#include <vector>
#include "SortSchedule.h"
using namespace std;
json FitnessByGroups(map<int, vector<json>> &scheduleForGroups,int max_day,double penaltySameTimesSc,double penaltyGrWin);
json FitnessByTeachers(map<int, vector<json>> &scheduleForTeachers,int max_day,double penaltySameTimesSc,double penaltyTeachWin);
json FitnessByAudiences(map<int, vector<json>> &scheduleForAudiences,double penaltySameTimesSc);
double FitnessWindows(json schedule,int max_day,double penaltyWin);
double FitnessSameTimes(json schedule,double penaltySameTimesSc);
double FitnessSameSchedules(map<int, vector<json>> &schedule,json recommedned_schedule,double penaltySameRecSchedules);

void Fitness(json &schedule,json recommended_schedules,int max_day,double penaltySameRecSc, double penaltyGrWin, double penaltySameTimesSc,double penaltyTeachWin){
    map<int, vector<json>> scheduleForGroups = schedule["scheduleForGroups"];
    map<int, vector<json>> scheduleForTeachers = schedule["scheduleForTeachers"];
    map<int, vector<json>> scheduleForAudiences = schedule["scheduleForAudiences"];
    bool sortedGroups = false,sortedTeachers= false,sortedAudiences=false;
    map<int, vector<json>>::iterator itGr=scheduleForGroups.begin(),itTeach=scheduleForTeachers.begin(),itAud= scheduleForAudiences.begin();
    while(!sortedGroups || !sortedTeachers || !sortedAudiences){
        if(itGr!=scheduleForGroups.end()){
            SortSchedule(itGr->second);
            itGr++;
        }
        else
            sortedGroups=true;
        if(itTeach!=scheduleForTeachers.end()){
            SortSchedule(itTeach->second);
            itTeach++;
        }
        else
            sortedTeachers=true;
        if(itAud!=scheduleForAudiences.end()){
            SortSchedule(itAud->second);
            itAud++;
        }
        else
            sortedAudiences=true;

    }
    json fitnessGr=FitnessByGroups(scheduleForGroups,max_day,penaltySameTimesSc,penaltyGrWin);
    json fitnessTeach = FitnessByTeachers(scheduleForTeachers,max_day,penaltySameTimesSc,penaltyTeachWin);
    json empty= {{"fitnessValue",0}};
    json fitnessAud = penaltySameTimesSc == 0 ? empty : FitnessByAudiences(scheduleForAudiences,penaltySameTimesSc);
    double fitnessSameRecSc = FitnessSameSchedules(scheduleForAudiences,recommended_schedules,penaltySameRecSc);

    double fitnessValue = (double)fitnessGr["fitnessValue"] + (double)fitnessTeach["fitnessValue"] + (double)fitnessAud["fitnessValue"] + fitnessSameRecSc;
    schedule["fitnessValue"]= {
        {"fitnessValue",fitnessValue},
        {"fitnessGr",fitnessGr},
        {"fitnessTeach",fitnessTeach},
        {"fitnessAud",fitnessAud},
        {"fitnessSameRecSc",fitnessSameRecSc},
    };
}


json FitnessByGroups(map<int, vector<json>> &scheduleForGroups,int max_day,double penaltySameTimesSc,double penaltyGrWin){
    double fitnessGrWin = 0;
    double fitnessSameTimesSc = 0;
    map<int, vector<json>>::iterator itGr=scheduleForGroups.begin();
    while(itGr!=scheduleForGroups.end()){
        fitnessGrWin += penaltyGrWin == 0 ? 0 : FitnessWindows(itGr->second,max_day,penaltyGrWin);
        fitnessSameTimesSc += penaltySameTimesSc == 0 ? 0 : FitnessSameTimes(itGr->second,penaltySameTimesSc);
        itGr++;
    }
    double fitnessValue = fitnessGrWin + fitnessSameTimesSc;
    return {
        {"fitnessValue",fitnessValue},
        {"fitnessGrWin",fitnessGrWin},
        {"fitnessSameTimesSc",fitnessSameTimesSc},
    };
}
json FitnessByTeachers(map<int, vector<json>> &scheduleForTeachers,int max_day,double penaltySameTimesSc,double penaltyTeachWin){
    double fitnessTeachWin = 0;
    double fitnessSameTimesSc = 0;
    map<int, vector<json>>::iterator itTeach=scheduleForTeachers.begin();
    while(itTeach!=scheduleForTeachers.end()){
        fitnessTeachWin += penaltyTeachWin == 0 ? 0 : FitnessWindows(itTeach->second,max_day,penaltyTeachWin);
        fitnessSameTimesSc += penaltySameTimesSc == 0 ? 0 : FitnessSameTimes(itTeach->second,penaltySameTimesSc);
        itTeach++;
    }
    double fitnessValue = fitnessTeachWin + fitnessSameTimesSc;
    return {
        {"fitnessValue",fitnessValue},
        {"fitnessTeachWin",fitnessTeachWin},
        {"fitnessSameTimesSc",fitnessSameTimesSc},
    };
}

json FitnessByAudiences(map<int, vector<json>> &scheduleForAudiences,double penaltySameTimesSc){
    double fitnessSameTimesSc = 0;
    map<int, vector<json>>::iterator itAud=scheduleForAudiences.begin();
    while(itAud!=scheduleForAudiences.end()){
        fitnessSameTimesSc += penaltySameTimesSc == 0 ? 0 : FitnessSameTimes(itAud->second,penaltySameTimesSc);
        itAud++;
    }
    double fitnessValue = fitnessSameTimesSc;
    return {
        {"fitnessValue",fitnessValue},
        {"fitnessSameTimesSc",fitnessSameTimesSc},
    };
}


double FitnessWindows(json schedule,int max_day,double penaltyWin){
    double fitnessWindows = 0;
    for(int current_day = 1; current_day <=max_day;current_day++){

        json schedule_top =json::array();
        json schedule_bot =json::array();
        for(json clas: schedule){
            if((int)clas["day_week"] == current_day){
                switch((int)clas["pair_type"]){
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

        json arr = json::array();

        for(int i = 0; i<(int)schedule_top.size()-1;i++){
            int diff = (int)(schedule_top[i+1]["number_pair"])-(int)(schedule_top[i]["number_pair"])-1;
            if(diff>1){
                fitnessWindows+=diff*penaltyWin;
                if((int)(schedule_top[i+1]["pair_type"])==3 && (int)(schedule_top[i]["pair_type"])==3){
                    json arrT = json::array();
                    arrT.push_back(schedule_top[i]);
                    arrT.push_back(schedule_top[i+1]);
                    arr.push_back(arrT);
                }

            }

        }

        for(int i = 0; i<(int)schedule_bot.size()-1;i++){
            int diff = (int)(schedule_bot[i+1]["number_pair"])-(int)(schedule_bot[i]["number_pair"])-1;
            if(diff>1){
                if((int)(schedule_bot[i+1]["pair_type"])==3 && (int)schedule_bot[i]["pair_type"]==3){
                    bool flag = false;
                    for(json arrJ: arr){
                        if(arrJ.find(schedule_bot[i])==arrJ.end() && arrJ.find(schedule_bot[i+1])==arrJ.end()){
                               flag = true;
                               break;
                        }
                    }
                    if(flag)
                            continue;
                }

                fitnessWindows+=diff*penaltyWin;
            }
        }
    }
    return fitnessWindows;
}

double FitnessSameSchedules(map<int, vector<json>> &schedule,json recommedned_schedule,double penaltySameRecSchedules){
    double fitnessSameRecSc = 0;
     map<int, vector<json>>::iterator itSc=schedule.begin();
     while(itSc!=schedule.end()){
         for(json clas : itSc->second){
             json recSc = json::array();
             for(json rs: recommedned_schedule){
                 if((int)rs["id_class"] == (int) clas["id_class"])
                     recSc.push_back(rs);
             }
             if(clas.size()){
                 json isSame = json::array();
                 for(json rs: recSc){
                     if((int)rs["day_week"] == (int)clas["day_week"] && (int)rs["number_pair"] == (int)clas["number_pair"])
                         isSame.push_back(rs);
                 }
                 if(isSame.size())
                     fitnessSameRecSc+=penaltySameRecSchedules;
             }
         }


         itSc++;
    }
     return fitnessSameRecSc;

}

double FitnessSameTimes(json schedule,double penaltySameTimesSc){
    double fitnessSameTimes = 0;
    json lastTop,lastBot,lastTotal;
    int cur_day = -1;
    for(int i=-1;i<(int)schedule.size()-1;i++){
        if((int)schedule[i+1]["day_week"] != cur_day){
            cur_day = (int)schedule[i+1]["day_week"];
            lastTop = NULL;
            lastBot = NULL;
            lastTotal = NULL;
            continue;
        }
        switch ((int)schedule[i]["pair_type"])
        {
            case 1:
                    lastTop = schedule[i];
                    break;
            case 2:
                    lastBot = schedule[i];
                    break;
            case 3:
                    lastTotal = schedule[i];
                    break;
        }
        if((int)schedule[i+1]["number_pair"] == (int)schedule[i]["number_pair"]){
            if((int)schedule[i+1]["pair_type"] == 1 && (lastTop.is_null() ? false : (int)lastTop["number_pair"] ==(int)schedule[i+1]["number_pair"] || lastTotal.is_null() ? false : (int)lastTotal["number_pair"] ==(int)schedule[i+1]["number_pair"])){
                fitnessSameTimes+=penaltySameTimesSc;
                continue;
            }
            if((int)schedule[i+1]["pair_type"] == 2 && (lastBot.is_null() ? false : (int)lastBot["number_pair"] ==(int)schedule[i+1]["pair_type"] || lastTotal.is_null() ? false : (int)lastTotal["number_pair"] ==(int)schedule[i+1]["number_pair"])){
                fitnessSameTimes+=penaltySameTimesSc;
                continue;
            }
            if((int)schedule[i+1]["pair_type"] == 3 && (lastTop.is_null() ? false : (int)lastTop["number_pair"] ==(int)schedule[i+1]["number_pair"] || lastBot.is_null() ? false :(int)lastBot["number_pair"] ==(int)schedule[i+1]["pair_type"] || lastTotal.is_null() ? false : (int)lastTotal["number_pair"] ==(int)schedule[i+1]["number_pair"])){
                fitnessSameTimes+=penaltySameTimesSc;
                continue;
            }
        }
    }
    return fitnessSameTimes;
}



