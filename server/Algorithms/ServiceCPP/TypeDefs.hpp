#ifndef TYPEDEFS_HPP
#define TYPEDEFS_HPP

#include "json.hpp"
#include <cfloat>
#include <string>
#include <vector>
#include <map>
using namespace std;
using namespace nlohmann;

struct schedule;

struct ContainId{
    int id;
    ContainId(){
        id = -1;
    }
    ContainId(int id){
        this->id = id;
    }
};

struct recommended_audience : ContainId
{
    recommended_audience(json &ra) : ContainId(ra["id_audience"]) {}
    recommended_audience() : ContainId() {}
};

struct recommended_schedule
{
    int number_pair;
    int day_week;
    recommended_schedule()
    {
        number_pair = -1;
        day_week = -1;
    }
    recommended_schedule(json &rec_schedule)
    {
        number_pair = (int)rec_schedule["number_pair"];
        day_week = (int)rec_schedule["day_week"];
    }
};

struct fitness
{
    double fitnessValue;
    double fitnessGrWin;
    double fitnessSameTimeGr;
    double fitnessTeachWin;
    double fitnessSameTimeTeach;
    double fitnessSameTimeAud;
    double fitnessSameRecSc;

    fitness()
    {
        this->fitnessValue = DBL_MAX;
        this->fitnessGrWin = DBL_MAX;
        this->fitnessSameTimeGr = DBL_MAX;
        this->fitnessTeachWin = DBL_MAX;
        this->fitnessSameTimeTeach = DBL_MAX;
        this->fitnessSameTimeAud = DBL_MAX;
        this->fitnessSameRecSc = DBL_MAX;
    }
    json to_json()
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
    fitness(double fitnessValue, double fitnessGrWin, double fitnessSameTimeGr, double fitnessTeachWin, double fitnessSameTimeTeach, double fitnessSameTimeAud, double fitnessSameRecSc)
    {
        this->fitnessValue = fitnessValue;
        this->fitnessGrWin = fitnessGrWin;
        this->fitnessSameTimeGr = fitnessSameTimeGr;
        this->fitnessTeachWin = fitnessTeachWin;
        this->fitnessSameTimeTeach = fitnessSameTimeTeach;
        this->fitnessSameTimeAud = fitnessSameTimeAud;
        this->fitnessSameRecSc = fitnessSameRecSc;
    }
};

struct teacher : public ContainId
{
    teacher() : ContainId() {}
    teacher(int id_teacher) : ContainId(id_teacher) {}
};

struct group : public ContainId
{
    int number_students;
    int semester;
    group() : ContainId()
    {
        number_students = -1;
        semester = -1;
    }
    group(json &group) : ContainId((int)group["id"])
    {
        number_students = (int)group["number_students"];
        semester = (int)group["semester"];
    }
};

struct clas
{
    int id;
    int id_type_class;
    double times_per_week;
    int id_assigned_discipline;
    int id_cathedra;
    vector<group> assigned_groups;
    vector<teacher> assigned_teachers;
    vector<recommended_audience> recommended_audiences;
    vector<recommended_schedule> recommended_schedules;
    vector<vector<schedule>> schedules;
    clas()
    {
        id = -1;
        id_type_class = -1;
        times_per_week = -1;
        id_assigned_discipline = -1;
        assigned_groups = vector<group>();
        assigned_teachers = vector<teacher>();
        recommended_audiences = vector<recommended_audience>();
        recommended_schedules = vector<recommended_schedule>();
        schedules = vector<vector<schedule>>();
        ;
        id_cathedra = -1;
    }
    clas(json &clas, const int &population_size)
    {
        id = (int)clas["id"];
        id_type_class = (int)clas["id_type_class"];
        times_per_week = (double)clas["times_per_week"];
        id_assigned_discipline = (int)clas["id_assigned_discipline"];
        assigned_groups = vector<group>();
        assigned_teachers = vector<teacher>();
        recommended_audiences = vector<recommended_audience>();
        recommended_schedules = vector<recommended_schedule>();
        schedules = vector<vector<schedule>>(population_size);
        id_cathedra = int(clas["assigned_discipline"]["specialty"]["id_cathedra"]);
        for (json &ag : clas["assigned_groups"])
        {
            assigned_groups.push_back(group(ag["group"]));
        }
        for (json &at : clas["assigned_teachers"])
        {
            assigned_teachers.push_back(teacher(at["id_teacher"]));
        }
        for (json &ra : clas["recommended_audiences"])
        {
            recommended_audiences.push_back(recommended_audience(ra));
        }
        for (json &rs : clas["recommended_schedules"])
        {
            recommended_schedules.push_back(recommended_schedule(rs));
        }
    }
};

struct audience : ContainId
{
    int id_type_class;
    int capacity;
    vector<int> cathedras;
    audience() : ContainId()
    {
        id_type_class = -1;
        capacity = -1;
        cathedras = vector<int>();
    }
    audience(json &audience) : ContainId(audience["id"])
    {
        id_type_class = audience["id_type_class"];
        capacity = audience["capacity"];
        cathedras = vector<int>();
        for (json &aa : audience["assigned_audiences"])
        {
            cathedras.push_back(aa["id_cathedra"]);
        }
    }
};

struct schedule
{
    int number_pair;
    int day_week;
    int pair_type;
    int id_audience;
    int id_class;
    schedule(int number_pair, int day_week, int pair_type, int id_audience, int id_class)
    {
        this->number_pair = number_pair;
        this->day_week = day_week;
        this->pair_type = pair_type;
        this->id_audience = id_audience;
        this->id_class = id_class;
    }
    schedule()
    {
        this->number_pair = -1;
        this->day_week = -1;
        this->pair_type = -1;
        this->id_audience = -1;
        this->id_class = -1;
    }
    json to_json()
    {
        json schedule;
        schedule["number_pair"] = number_pair;
        schedule["day_week"] = day_week;
        schedule["pair_type"] = pair_type;
        schedule["id_audience"] = id_audience;
        schedule["id_class"] = id_class;
        return schedule;
    }
};

struct base_schedule
{
    map<int, vector<schedule>> base_schedule_group;
    map<int, vector<schedule>> base_schedule_teacher;
    map<int, vector<schedule>> base_schedule_audience;
    base_schedule()
    {
        this->base_schedule_group = map<int, vector<schedule>>();
        this->base_schedule_teacher = map<int, vector<schedule>>();
        this->base_schedule_audience = map<int, vector<schedule>>();
    }
    base_schedule(json &base_schedule_group, json &base_schedule_teacher, json &base_schedule_audience)
    {
        this->base_schedule_group = map<int, vector<schedule>>();
        this->base_schedule_teacher = map<int, vector<schedule>>();
        this->base_schedule_audience = map<int, vector<schedule>>();
        for (size_t i = 0; i < base_schedule_group.size(); i++)
        {
            int id = base_schedule_group[i]["id"];
            auto v = vector<schedule>();
            for (size_t j = 0; j < base_schedule_group[i]["schedule"].size(); j++)
            {
                v.push_back(schedule(base_schedule_group[i]["schedule"][j]["number_pair"],
                                     base_schedule_group[i]["schedule"][j]["day_week"],
                                     base_schedule_group[i]["schedule"][j]["pair_type"],
                                     base_schedule_group[i]["schedule"][j]["id_audience"],
                                     base_schedule_group[i]["schedule"][j]["id_class"]));
            }
            this->base_schedule_group[id] = v;
        }
        for (size_t i = 0; i < base_schedule_teacher.size(); i++)
        {
            int id = base_schedule_teacher[i]["id"];
            auto v = vector<schedule>();
            for (size_t j = 0; j < base_schedule_teacher[i]["schedule"].size(); j++)
            {
                v.push_back(schedule(base_schedule_teacher[i]["schedule"][j]["number_pair"],
                                     base_schedule_teacher[i]["schedule"][j]["day_week"],
                                     base_schedule_teacher[i]["schedule"][j]["pair_type"],
                                     base_schedule_teacher[i]["schedule"][j]["id_audience"],
                                     base_schedule_teacher[i]["schedule"][j]["id_class"]));
            }
            this->base_schedule_teacher[id] = v;
        }
        for (size_t i = 0; i < base_schedule_audience.size(); i++)
        {
            int id = base_schedule_audience[i]["id"];
            auto v = vector<schedule>();
            for (size_t j = 0; j < base_schedule_audience[i]["schedule"].size(); j++)
            {
                v.push_back(schedule(base_schedule_audience[i]["schedule"][j]["number_pair"],
                                     base_schedule_audience[i]["schedule"][j]["day_week"],
                                     base_schedule_audience[i]["schedule"][j]["pair_type"],
                                     base_schedule_audience[i]["schedule"][j]["id_audience"],
                                     base_schedule_audience[i]["schedule"][j]["id_class"]));
            }
            this->base_schedule_audience[id] = v;
        }
    }
};

struct individ
{
    map<int, vector<schedule *>> scheduleForGroups;
    map<int, vector<schedule *>> scheduleForTeachers;
    map<int, vector<schedule *>> scheduleForAudiences;
    fitness fitnessValue;
    individ()
    {
        this->scheduleForGroups = map<int, vector<schedule *>>();
        this->scheduleForTeachers = map<int, vector<schedule *>>();
        this->scheduleForAudiences = map<int, vector<schedule *>>();
    }
};

struct bestIndivid
{
    vector<schedule> arr_schedule;
    fitness fitnessValue;
    json to_json()
    {
        json arr = json::array();
        for (auto &sch : this->arr_schedule)
        {
            arr.push_back(sch.to_json());
        }
        return arr;
    }
    bestIndivid()
    {
        this->arr_schedule = vector<schedule>();
        this->fitnessValue = fitness();
    }
};

#endif // TYPEDAFS_HPP
