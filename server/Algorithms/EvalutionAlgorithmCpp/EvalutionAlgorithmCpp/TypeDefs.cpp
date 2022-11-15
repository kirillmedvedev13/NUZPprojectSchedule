#include "TypeDefs.h"

teacher::teacher()
{
    id=-1;
}

teacher::teacher(json &teacher)
{
    id = (int)teacher["id"];

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

schedule::schedule(int id, int number_pair, int day_week, int pair_type, int id_audience, int id_class)
{
    this->id = id;
    this->number_pair = number_pair;
    this->day_week = day_week;
    this->pair_type = pair_type;
    this->id_audience = id_audience;
    this->clas = nullptr;
    this->id_class = id_class;
}

schedule::schedule(int id, int number_pair, int day_week, int pair_type, int id_audience,struct clas &clas)
{
    this->id = id;
    this->number_pair = number_pair;
    this->day_week = day_week;
    this->pair_type = pair_type;
    this->id_audience = id_audience;
    this->clas = &clas;
    this->id_class = -1;
}

schedule::schedule()
{
    this->id = -1;
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
    schedule["id"] = id;
    schedule["number_pair"] = number_pair;
    schedule["day_week"] = day_week;
    schedule["pair_type"] = pair_type;
    schedule["id_audience"] = id_audience;
    schedule["id_class"] = clas->id;
    return schedule;
}


fitness::fitness()
{
    this->fitnessValue = -1;
    this->fitnessGr = map<string, double>();
    this->fitnessTeach = map<string, double>();
    this->fitnessAud = map<string, double>();
    this->fitnessSameRecSc = -1;
}

json fitness::to_json()
{
    json fitness;
    fitness["fitnessValue"] = fitnessValue;
    fitness["fitnessGr"] = fitnessGr;
    fitness["fitnessTeach"] = fitnessTeach;
    fitness["fitnessAud"] = fitnessAud;

    return fitness;
}

fitness::fitness(double fitnessValue, map<string, double> fitnessGr, map<string, double> fitnessTeach, map<string, double> fitnessAud, double fitnessSameRecSc)
{
    this->fitnessValue= fitnessValue;
    this->fitnessGr= fitnessGr;
    this->fitnessTeach= fitnessTeach;
    this->fitnessAud= fitnessAud;
    this->fitnessSameRecSc= fitnessSameRecSc;
}

json individ::to_json()
{
    json i_schedule;
    json scheduleForGr;
    for (auto sch : this->scheduleForGroups) {
        json temp;
        json arr = json::array();
        for (schedule t : sch.second) {
            arr.push_back(t.to_json());
        }
        scheduleForGr[to_string(sch.first)] = arr;
    }
    i_schedule["scheduleForGr"] = scheduleForGr;
    i_schedule["fitnessValue"] = fitnessValue.to_json();

    return i_schedule;
}

individ::individ()
{
    scheduleForGroups= map <int, vector<schedule>>();
    scheduleForTeachers= map <int, vector<schedule>>();
    scheduleForAudiences= map <int, vector<schedule>>();
    fitnessValue = fitness();
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
    this->base_schedule_group = vector<schedule>();
    this->base_schedule_teacher = vector<schedule>();
    this->base_schedule_audience = vector<schedule>();
}

base_schedule::base_schedule(json &base_schedule_group, json &base_schedule_teacher, json &base_schedule_audience){
    this->base_schedule_group = vector<schedule>();
    this->base_schedule_teacher = vector<schedule>();
    this->base_schedule_audience = vector<schedule>();
    for (size_t i = 0; i < base_schedule_group.size(); i++){
             this->base_schedule_group.push_back(
                    schedule(base_schedule_group[i]["schedule"]["id"],
                    base_schedule_group[i]["schedule"]["number_pair"],
                    base_schedule_group[i]["schedule"]["day_week"],
                    base_schedule_group[i]["schedule"]["pair_type"],
                    base_schedule_group[i]["schedule"]["id_audience"],
                    base_schedule_group[i]["schedule"]["id_class"]));
    }
    for (size_t i = 0; i < base_schedule_teacher.size(); i++){
            this->base_schedule_teacher.push_back(
                    schedule(base_schedule_teacher[i]["schedule"]["id"],
                    base_schedule_teacher[i]["schedule"]["number_pair"],
                    base_schedule_teacher[i]["schedule"]["day_week"],
                    base_schedule_teacher[i]["schedule"]["pair_type"],
                    base_schedule_teacher[i]["schedule"]["id_audience"],
                    base_schedule_teacher[i]["schedule"]["id_class"]));
    }
    for (size_t i = 0; i < base_schedule_audience.size(); i++){
             this->base_schedule_audience.push_back(
                    schedule(base_schedule_audience[i]["schedule"]["id"],
                    base_schedule_audience[i]["schedule"]["number_pair"],
                    base_schedule_audience[i]["schedule"]["day_week"],
                    base_schedule_audience[i]["schedule"]["pair_type"],
                    base_schedule_audience[i]["schedule"]["id_audience"],
                    base_schedule_audience[i]["schedule"]["id_class"]));
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
    id_cathedra = -1;
}


clas::clas(json &clas)
{
	id = (int)clas["id"];
	id_type_class = (int)clas["id_type_class"];
    times_per_week = (double)clas["times_per_week"];
    id_assigned_discipline = (int)clas["id_assigned_discipline"];
    assigned_groups = vector <group>();
    assigned_teachers = vector <teacher>();
	recommended_audiences = vector <recommended_audience>();
	recommended_schedules = vector <recommended_schedule >();
    id_cathedra = int(clas["assigned_discipline"]["specialty"]["id_cathedra"]);
    for (json &ag : clas["assigned_groups"]) {
        assigned_groups.push_back(group(ag["group"]));
	}
    for (json &at : clas["assigned_teachers"]) {
        assigned_teachers.push_back(teacher(at["teacher"]));
	}
    for (json &ra : clas["recommended_audiences"]) {
		recommended_audiences.push_back(recommended_audience(ra));
	}
    for (json &rs : clas["recommended_schedules"]) {
        recommended_schedules.push_back(recommended_schedule(rs));
	}
}


