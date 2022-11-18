#ifndef TYPEDEFS_H
#define TYPEDEFS_H

#include "json.hpp"
#include <string>
#include <vector>
#include <map>
using namespace std;
using namespace nlohmann;

struct schedule;

struct recommended_audience {
    int id_audience;
    recommended_audience(json &ra);
    recommended_audience();
};

struct recommended_schedule {
    int number_pair;
    int day_week;
    recommended_schedule();
    recommended_schedule(json &rec_schedule);
};


struct fitness {
    double fitnessValue;
    double fitnessGrWin;
    double fitnessSameTimeGr;
    double fitnessTeachWin;
    double fitnessSameTimeTeach;
    double fitnessSameTimeAud;
    double fitnessSameRecSc;
    fitness();
    json to_json();
    fitness(double fitnessValue, double fitnessGrWin,double fitnessSameTimeG, double fitnessTeachWin, double fitnessSameTimeTeach,double fitnessSameTimeAudm,double fitnessSameRecSc);
};

struct teacher{
    int id;
    teacher();
    teacher(int id_teacher);
};

struct group{
    int id;
    int number_students;
    int semester;
    group();
    group(json &group);

};



struct clas{
    int id;
    int id_type_class;
    double times_per_week;
    int id_assigned_discipline;
    int id_cathedra;
    vector <group> assigned_groups;
    vector <teacher> assigned_teachers;
    vector <recommended_audience> recommended_audiences;
    vector <recommended_schedule> recommended_schedules;
    vector <vector <schedule>> schedules;
    clas();
    clas(json &clas, const int &population_size);
};


struct audience{
    int id;
    int id_type_class;
    int capacity;
    vector <int> cathedras;
    audience();
    audience(json &audience);

};

struct schedule {
    int number_pair;
    int day_week;
    int pair_type;
    int id_audience;
    int id_class;
    schedule(int number_pair, int day_week, int pair_type, int id_audience,int id_class);
    schedule();
    json to_json();
};

struct base_schedule{
    map<int,vector<schedule>> base_schedule_group;
    map<int,vector<schedule>> base_schedule_teacher;
    map<int,vector<schedule>> base_schedule_audience;
    base_schedule();
    base_schedule(json &base_schedule_group, json &base_schedule_teacher, json &base_schedule_audience);
};



struct individ {
    map <int, vector<schedule*>> scheduleForGroups;
    map <int, vector<schedule*>> scheduleForTeachers;
    map <int, vector<schedule*>> scheduleForAudiences;
    fitness fitnessValue;
    individ();
};

struct bestIndivid {
    vector<schedule> arr_schedule;
    fitness fitnessValue;
    json to_json();
    bestIndivid();
};

#endif // TYPEDAFS_H
