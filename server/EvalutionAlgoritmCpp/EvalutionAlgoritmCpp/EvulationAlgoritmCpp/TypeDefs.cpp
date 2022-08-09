#include "TypeDefs.h"

teacher::teacher()
{
	id=-1;
	name = "";
	surname = "";
	patronymic = "";
	id_cathedra = -1;
	assigned_teachers = vector<assigned_teacher>();
}

teacher::teacher(json teacher)
{
	id = (int)teacher["id"];
	name = teacher["name"];
	surname = teacher["surname"];
	patronymic = teacher["patronymic"];
	id_cathedra = (int)teacher["id_cathedra"];
	assigned_teachers = vector<assigned_teacher>();
	for (json at : teacher["assigned_teachers"]) {
		assigned_teachers.push_back(assigned_teacher (at));
	}

}

bool teacher::isNullOrEmpty()
{
	if (id == -1 || name.empty() || surname.empty() || patronymic.empty() || id_cathedra == -1)
		return true;
	return false;
}

recommended_schedule::recommended_schedule()
{
	id = -1;
	number_pair = -1;
	day_week = -1;
	id_class = -1;
}

recommended_schedule::recommended_schedule(json rec_schedule)
{
	id = (int)rec_schedule["id"];
	number_pair = (int)rec_schedule["number_pair"];
	day_week = (int)rec_schedule["day_week"];
	id_class = (int)rec_schedule["id_class"];
}

bool recommended_schedule::isNullOrEmpty()
{
	if (id == -1 || number_pair == -1 || day_week == -1 || id_class == -1)
		return true;
	return false;
}

assigned_teacher::assigned_teacher(json at)
{
	id = at["id"];
	id_class = at["id_class"];
	id_teacher = at["id_teacher"];
}

assigned_teacher::assigned_teacher()
{

	id = -1;
	id_class = -1;
	id_teacher = -1;
}

group::group()
{
	id=-1;
	name ="";
	number_students = -1;
	semester = -1;
	id_specialty = -1;
}

group::group(json group)
{
	id = (int)group["id"];
	name = group["name"];
	number_students = (int)group["number_students"];
	semester = (int)group["semester"];
	id_specialty = (int)group["id_specialty"];

}

bool group::isNullOrEmpty()
{
	if (id == -1 || name.empty() || number_students == -1 || semester == -1 || id_specialty == -1)
		return true;
	return false;
}

clas::clas()
{
	id = -1;
	id_type_class = -1;
	times_per_week = -1;
	id_assigned_discipline=-1;
	assigned_groups= vector <assigned_group>();
	assigned_teachers= vector <assigned_teacher>();
	recommended_audiences= vector <recommended_audience>();
	recommended_schedules= vector <recommended_schedule >();
	cl_assigned_discipline = assigned_discipline();
}

clas::clas(json clas)
{
	id = (int)clas["id"];
	id_type_class = (int)clas["id_type_class"];
	times_per_week = (double)clas["times_per_week"];
	id_assigned_discipline = (int)clas["id_assigned_discipline"];
	cl_assigned_discipline = assigned_discipline(clas["assigned_discipline"]);
	assigned_groups = vector <assigned_group>();
	assigned_teachers = vector <assigned_teacher>();
	recommended_audiences = vector <recommended_audience>();
	recommended_schedules = vector <recommended_schedule >();
	for (json ag : clas["assigned_groups"]) {
		assigned_groups.push_back(assigned_group (ag));
	}
	for (json at : clas["assigned_teachers"]) {
		assigned_teachers.push_back(assigned_teacher(at));
	}
	for (json ra : clas["recommended_audiences"]) {
		recommended_audiences.push_back(recommended_audience(ra));
	}
	for (json rs : clas["recommended_schedules"]) {
		recommended_schedules.push_back(recommended_schedule(rs));
	}
}

bool clas::isNullOrEmpty()
{
	if (id==-1 || id_type_class==-1 || times_per_week==-1||id_assigned_discipline ==-1)
		return true;
	return false;
}

assigned_group::assigned_group(json ag)
{
    id = (int)ag["id"];
	id_class = (int)ag["id_class"];
	id_group = (int)ag["id_group"];
	this->a_group = group(ag["group"]);
}

assigned_group::assigned_group()
{
	int id = -1;
	int id_class = -1;
	int id_group = -1;
	this->a_group = group();

}

audience::audience()
{
	id=-1;
	name="";
	id_type_class = -1;
	capacity = -1;
	assigned_audiences= vector <assigned_audience>();
}

audience::audience(json audience)
{
	id = audience["id"];
	name = audience["name"];
	id_type_class = audience["id_type_class"];
	capacity = audience["capacity"];
	assigned_audiences = vector <assigned_audience>();
	for (json aa : audience["assigned_audiences"]) {
		assigned_audiences.push_back(assigned_audience(aa));
	}
}

bool audience::isNullOrEmpty()
{
	if (id == -1 || name.empty() || id_type_class == -1 || capacity == -1)
		return true;
	return false;
}

assigned_audience::assigned_audience(json aa)
{
	id = (int)aa["id"];
	id_audience= (int)aa["id_audience"];
	id_cathedra = (int)aa["id_cathedra"];
}

assigned_audience::assigned_audience()
{
	id = -1;
	id_audience = -1;
	id_cathedra = -1;
}

schedule::schedule(int id, int number_pair, int day_week, int pair_type, int id_assigned_group, int id_audience,int id_class)
{
	this->id = id;
	this->number_pair = number_pair;
	this->day_week = day_week;
	this->pair_type = pair_type;
	this->id_assigned_group = id_assigned_group;
	this->id_audience = id_audience;
	this->id_class = id_class;
}

schedule::schedule()
{
	this->id = -1;
	this->number_pair = -1;
	this->day_week = -1;
	this->pair_type = -1;
	this->id_assigned_group = -1;
	this->id_audience = -1;
}

bool schedule::compare(schedule sc)
{
	if (id == sc.id && number_pair == sc.number_pair && day_week == sc.day_week && pair_type == sc.pair_type && id_assigned_group == sc.id_assigned_group && id_audience == sc.id_audience && id_class == sc.id_class)
		return true;
	return false;
}

bool schedule::isNullOrEmpty()
{
	if (id == -1 || number_pair == -1 || day_week == -1 || pair_type == -1 || id_assigned_group == -1 || id_audience == -1 || id_class == -1)
		return true;
	return false;
}

fitness::fitness()
{
	this->fitnessValue = -1;
	this->fitnessGr = map<string, double>();
	this->fitnessTeach = map<string, double>();
	this->fitnessAud = map<string, double>();
	this->fitnessSameRecSc = -1;
}

fitness::fitness(double fitnessValue, map<string, double> fitnessGr, map<string, double> fitnessTeach, map<string, double> fitnessAud, double fitnessSameRecSc)
{
	this->fitnessValue= fitnessValue;
	this->fitnessGr= fitnessGr;
	this->fitnessTeach= fitnessTeach;
	this->fitnessAud= fitnessAud;
	this->fitnessSameRecSc= fitnessSameRecSc;
}

individ::individ()
{
	scheduleForGroups= map <int, vector<schedule>>();
	scheduleForTeachers= map <int, vector<schedule>>();
	scheduleForAudiences= map <int, vector<schedule>>();
	fitnessValue = fitness();

}

specialty::specialty(json spec)
{
	id= spec["id"];
	name= spec["name"];
	code= spec["code"];
	id_cathedra=spec["id_cathedra"];
}

specialty::specialty()
{
	id = -1;
	name = "";
	code = -1;
	id_cathedra = -1;
}

assigned_discipline::assigned_discipline(json ad)
{
	id= ad["id"];
	id_specialty = ad["id_specialty"];
	id_discipline = ad["id_discipline"];
	semester = ad["semester"];
	this->ad_specialty =specialty(ad["specialty"]);
}

assigned_discipline::assigned_discipline()
{
	id = -1;
	id_specialty = -1;
	id_discipline = -1;
	semester = -1;
	this->ad_specialty = specialty();
}

recommended_audience::recommended_audience(json ra)
{
	id=ra["id"];
	id_audience = ra["id_audience"];
	id_class = ra["id_class"];
}

recommended_audience::recommended_audience()
{
	id = -1;
	id_audience = -1;
	id_class = -1;
}
