#pragma once
#include "json.hpp"
#include <string>
#include <vector>
#include <map>
using namespace std;
using namespace nlohmann;

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
	bool isNullOrEmpty();
};


struct fitness {
	double fitnessValue;
	map<string, double> fitnessGr;
	map<string, double> fitnessTeach;
	map<string, double> fitnessAud;
	double fitnessSameRecSc;
	fitness();
	json to_json();
	fitness(double fitnessValue, map<string, double> fitnessGr, map<string, double> fitnessTeach, map<string, double> fitnessAud, double fitnessSameRecSc);
};

struct teacher{
    int id;
    teacher();
    teacher(json &teacher);
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
    vector <recommended_schedule >recommended_schedules;
    clas();
    clas(json &clas);
};

struct schedule {
    int id;
    int number_pair;
    int day_week;
    int pair_type;
    int id_audience;
    int id_class;
    clas *clas;
    schedule(int id, int number_pair, int day_week, int pair_type, int id_audience,struct clas &clas);
        schedule(int id, int number_pair, int day_week, int pair_type, int id_audience,int id_class);
    schedule();
    json to_json();
};


struct individ {
	map <int, vector<schedule>> scheduleForGroups;
	map <int, vector<schedule>> scheduleForTeachers;
	map <int, vector<schedule>> scheduleForAudiences;
	fitness fitnessValue;
	json to_json();
	individ();
};



struct audience{
	int id;
	int id_type_class;
	int capacity;
    vector <int> cathedras;
	audience();
    audience(json &audience);

};

struct base_schedule{
    vector<schedule> base_schedule_group;
    vector<schedule> base_schedule_teacher;
    vector<schedule> base_schedule_audience;
    base_schedule();
    base_schedule(json &base_schedule_group, json &base_schedule_teacher, json &base_schedule_audience);
};



