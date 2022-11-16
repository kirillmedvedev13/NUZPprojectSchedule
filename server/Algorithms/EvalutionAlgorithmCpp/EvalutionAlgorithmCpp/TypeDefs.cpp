#include "TypeDefs.h"

teacher::teacher()
{
    id=-1;
}

teacher::teacher(int id_teacher)
{
    id = id_teacher;

}


recommended_schedule::recommended_schedule()
{
    number_pair = -1;
    day_week = -1;
}

recommended_schedule::recommended_schedule(json &rec_schedule)
{
    number_pair = (int)rec_schedule["number_pair"];
    day_week = (int)rec_schedule["day_week"];
}



group::group()
{
    id=-1;
    number_students = -1;
    semester = -1;
}

group::group(json &group)
{
    id = (int)group["id"];
    number_students = (int)group["number_students"];
    semester = (int)group["semester"];
}


audience::audience()
{
    id=-1;
    id_type_class = -1;
    capacity = -1;
    cathedras = vector <int>();
}

audience::audience(json &audience)
{
    id = audience["id"];
    id_type_class = audience["id_type_class"];
    capacity = audience["capacity"];
    cathedras = vector <int>();
    for (json &aa : audience["assigned_audiences"]) {
        cathedras.push_back(aa["id_cathedra"]);
    }
}

schedule::schedule(int number_pair, int day_week, int pair_type, int id_audience, int id_class)
{
    this->number_pair = number_pair;
    this->day_week = day_week;
    this->pair_type = pair_type;
    this->id_audience = id_audience;
    this->clas = nullptr;
    this->id_class = id_class;
}

schedule::schedule(int number_pair, int day_week, int pair_type, int id_audience,struct clas &clas)
{
    this->number_pair = number_pair;
    this->day_week = day_week;
    this->pair_type = pair_type;
    this->id_audience = id_audience;
    this->clas = &clas;
    this->id_class = -1;
}

schedule::schedule()
{
    this->number_pair = -1;
    this->day_week = -1;
    this->pair_type = -1;
    this->id_audience = -1;
    this->clas = nullptr;
    this->id_class = -1;
}

json schedule::to_json()
{
    json schedule;
    schedule["number_pair"] = number_pair;
    schedule["day_week"] = day_week;
    schedule["pair_type"] = pair_type;
    schedule["id_audience"] = id_audience;
    schedule["id_class"] = clas->id;
    return schedule;
}


fitness::fitness()
{
    this->fitnessValue = INT_MAX;
    this->fitnessGrWin = INT_MAX;
    this->fitnessSameTimeGr = INT_MAX;
    this->fitnessTeachWin = INT_MAX;
    this->fitnessSameTimeTeach = INT_MAX;
    this->fitnessSameTimeAud = INT_MAX;
    this->fitnessSameRecSc = INT_MAX;
}

json fitness::to_json()
{
    json fitness;
    fitness["fitnessValue"] = fitnessValue;
    auto m = map<string, double>();
    m["fitnessGrWin"] = fitnessGrWin;
    m["fitnessSameTimeSc"] = fitnessSameTimeGr;
    m["fitnessValue"] = fitnessGrWin + fitnessSameTimeGr;
    fitness["fitnessGr"] = m;
    m.clear();
    m["fitnessTeachWin"] = fitnessTeachWin;
    m["fitnessSameTimeSc"] = fitnessSameTimeTeach;
    m["fitnessValue"] = fitnessTeachWin + fitnessTeachWin;
    fitness["fitnessTeach"] = m;
    m.clear();
    m["fitnessSameTimeAud"] = fitnessSameTimeTeach;
    m["fitnessValue"] = fitnessSameTimeTeach;
    fitness["fitnessAud"] = m;
    fitness["fitnessSameRecSc"] = fitnessSameRecSc;
    return fitness;
}

fitness::fitness(double fitnessValue, double fitnessGrWin,double fitnessSameTimeGr, double fitnessTeachWin, double fitnessSameTimeTeach,double fitnessSameTimeAud,double fitnessSameRecSc)
{
    this->fitnessValue = fitnessValue;
    this->fitnessGrWin = fitnessGrWin;
    this->fitnessSameTimeGr = fitnessSameTimeGr;
    this->fitnessTeachWin = fitnessTeachWin;
    this->fitnessSameTimeTeach = fitnessSameTimeTeach;
    this->fitnessSameTimeAud = fitnessSameTimeAud;
    this->fitnessSameRecSc = fitnessSameRecSc;
}

json bestIndivid::to_json()
{
    json arr = json::array();
    for (auto &sch : this->arr_schedule) {
        arr.push_back(sch.to_json());
    }
    return arr;
}

bestIndivid::bestIndivid()
{
    this->arr_schedule = vector<schedule> ();
    this->fitnessValue = fitness();
}

individ::individ()
{
    this->scheduleForGroups = map<int,vector<schedule*>>();
    this->scheduleForTeachers = map<int,vector<schedule*>>();
    this->scheduleForAudiences = map<int,vector<schedule*>>();
}


recommended_audience::recommended_audience(json &ra)
{
    id_audience = ra["id_audience"];
}

recommended_audience::recommended_audience()
{
    id_audience = -1;
}

base_schedule::base_schedule(){
    this->base_schedule_group =map<int,vector<schedule>>();
    this->base_schedule_teacher = map<int,vector<schedule>>();
    this->base_schedule_audience = map<int,vector<schedule>>();
}

base_schedule::base_schedule(json &base_schedule_group, json &base_schedule_teacher, json &base_schedule_audience){
    this->base_schedule_group = map<int,vector<schedule>>();
    this->base_schedule_teacher = map<int,vector<schedule>>();
    this->base_schedule_audience =map<int,vector<schedule>>();
    for (size_t i = 0; i < base_schedule_group.size(); i++){
        int id = base_schedule_group[i]["id"];
        auto v = vector<schedule>();
        for (size_t j = 0; j < base_schedule_group[i]["schedule"].size(); j++){
            v.push_back(schedule(base_schedule_group[i]["schedule"][j]["number_pair"],
                    base_schedule_group[i]["schedule"][j]["day_week"],
                    base_schedule_group[i]["schedule"][j]["pair_type"],
                    base_schedule_group[i]["schedule"][j]["id_audience"],
                    base_schedule_group[i]["schedule"][j]["id_class"]
                    ));
        }
        this->base_schedule_group[id] = v;
    }
    for (size_t i = 0; i < base_schedule_teacher.size(); i++){
        int id = base_schedule_teacher[i]["id"];
        auto v = vector<schedule>();
        for (size_t j = 0; j < base_schedule_teacher[i]["schedule"].size(); j++){
            v.push_back(schedule(base_schedule_teacher[i]["schedule"][j]["number_pair"],
                    base_schedule_teacher[i]["schedule"][j]["day_week"],
                    base_schedule_teacher[i]["schedule"][j]["pair_type"],
                    base_schedule_teacher[i]["schedule"][j]["id_audience"],
                    base_schedule_teacher[i]["schedule"][j]["id_class"]
                    ));
        }
        this->base_schedule_teacher[id] = v;
    }
    for (size_t i = 0; i < base_schedule_audience.size(); i++){
        int id = base_schedule_audience[i]["id"];
        auto v = vector<schedule>();
        for (size_t j = 0; j < base_schedule_audience[i]["schedule"].size(); j++){
            v.push_back(schedule(base_schedule_audience[i]["schedule"][j]["number_pair"],
                    base_schedule_audience[i]["schedule"][j]["day_week"],
                    base_schedule_audience[i]["schedule"][j]["pair_type"],
                    base_schedule_audience[i]["schedule"][j]["id_audience"],
                    base_schedule_audience[i]["schedule"][j]["id_class"]
                    ));
        }
        this->base_schedule_audience[id] = v;
    }

}

clas::clas()
{
    id = -1;
    id_type_class = -1;
    times_per_week = -1;
    id_assigned_discipline=-1;
    assigned_groups= vector <group>();
    assigned_teachers= vector <teacher>();
    recommended_audiences= vector <recommended_audience>();
    recommended_schedules= vector <recommended_schedule >();
    schedules = vector<vector <schedule>>();;
    id_cathedra = -1;
}


clas::clas(json &clas, const int &population_size)
{
    id = (int)clas["id"];
    id_type_class = (int)clas["id_type_class"];
    times_per_week = (double)clas["times_per_week"];
    id_assigned_discipline = (int)clas["id_assigned_discipline"];
    assigned_groups = vector <group>();
    assigned_teachers = vector <teacher>();
    recommended_audiences = vector <recommended_audience>();
    recommended_schedules = vector <recommended_schedule >();
    schedules = vector<vector<schedule>>(population_size);
    id_cathedra = int(clas["assigned_discipline"]["specialty"]["id_cathedra"]);
    for (json &ag : clas["assigned_groups"]) {
        assigned_groups.push_back(group(ag["group"]));
    }
    for (json &at : clas["assigned_teachers"]) {
        assigned_teachers.push_back(teacher(at["id_teacher"]));
    }
    for (json &ra : clas["recommended_audiences"]) {
        recommended_audiences.push_back(recommended_audience(ra));
    }
    for (json &rs : clas["recommended_schedules"]) {
        recommended_schedules.push_back(recommended_schedule(rs));
    }
}


