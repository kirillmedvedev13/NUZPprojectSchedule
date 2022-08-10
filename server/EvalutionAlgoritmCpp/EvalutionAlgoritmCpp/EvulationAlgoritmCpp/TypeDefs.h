#pragma once
#include "json.hpp"
#include <string>
#include <vector>
#include <map>
using namespace std;
using namespace nlohmann;

struct recommended_audience {
	int id;
	int id_audience;
	int id_class;
	recommended_audience(json ra);
	recommended_audience();
};
struct specialty {
	int id;
	string name;
	int code;
	int id_cathedra;
	specialty(json spec);
	specialty();
};
struct assigned_discipline {
	int id;
	int id_specialty;
	int id_discipline;
	int semester;
	specialty ad_specialty;
	assigned_discipline(json ad);
	assigned_discipline();
};

struct recommended_schedule {
	int id;
	int number_pair;
	int day_week;
	int id_class;
	recommended_schedule();
	recommended_schedule(json rec_schedule);
	bool isNullOrEmpty();
};

struct schedule {
	int id;
	int number_pair;
	int day_week;
	int pair_type;
	int id_assigned_group;
	int id_audience;
	int id_class;
	schedule(int id, int number_pair, int day_week, int pair_type, int id_assigned_group, int id_audience,int id_class);
	schedule();
	bool compare(schedule sc);
	bool isNullOrEmpty();
};
struct fitness {
	double fitnessValue;
	map<string, double> fitnessGr;
	map<string, double> fitnessTeach;
	map<string, double> fitnessAud;
	double fitnessSameRecSc;
	fitness();
	fitness(double fitnessValue, map<string, double> fitnessGr, map<string, double> fitnessTeach, map<string, double> fitnessAud, double fitnessSameRecSc);
};
struct individ {
	map <int, vector<schedule>> scheduleForGroups;
	map <int, vector<schedule>> scheduleForTeachers;
	map <int, vector<schedule>> scheduleForAudiences;
	fitness fitnessValue;
	individ();
	individ(map <int, vector<schedule>> scheduleForGroups,map <int, vector<schedule>> scheduleForTeachers,map <int, vector<schedule>> scheduleForAudiences,fitness fitnessValue);
};
struct assigned_teacher {
	int id;
	int id_class;
	int id_teacher;
	assigned_teacher(json at);
	assigned_teacher();
};
struct teacher{
	int id;
	string name;
	string surname;
	string patronymic;
	int id_cathedra;
	vector<assigned_teacher> assigned_teachers;
	teacher();
	teacher(json teacher);
	bool isNullOrEmpty();
};

struct group{
	int id;
	string name;
	int number_students;
	int semester;
	int id_specialty;
	group();
	group(json group);
	bool isNullOrEmpty();

};
struct assigned_group {
	int id;
	int id_class;
	int id_group;
	group a_group;
	assigned_group(json ag);
	assigned_group();
};
struct clas{
	int id;
	int id_type_class;
	double times_per_week;
	int id_assigned_discipline;
	vector <assigned_group> assigned_groups;
	vector <assigned_teacher> assigned_teachers;
	vector <recommended_audience> recommended_audiences;
	vector <recommended_schedule >recommended_schedules;
	assigned_discipline cl_assigned_discipline;

	clas();
	clas(json clas);
	bool isNullOrEmpty();
};



struct assigned_audience {
	int id;
	int id_audience;
	int id_cathedra;
	assigned_audience(json aa);
	assigned_audience();
};

struct audience{
	int id;
	string name;
	int id_type_class;
	int capacity;
	vector <assigned_audience> assigned_audiences;
	audience();
	audience(json audience);
	bool isNullOrEmpty();

};


