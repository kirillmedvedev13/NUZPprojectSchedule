#include "Crossing.h"
#include "GetRndInteger.h"
#include <set>
#include <iostream>
using namespace std;
void Crossing(individ& schedule1, individ& schedule2, const vector<clas>& classes)
{
	
	int start = GetRndInteger(0, (classes.size() - 1));
	int end = GetRndInteger(start, (classes.size() - 1));
	for(int i = start;i<end;i++)
	{
		set<int>id_aud1;
		set<int> id_aud2;
		bool isFirst = false;
		for(assigned_group ag: classes[i].assigned_groups)
		{
			vector<schedule>& scheduleForGr1 = schedule1.scheduleForGroups.find(ag.id_group)->second;
			vector<schedule> tempT1,tempF1;
			for(schedule sch: scheduleForGr1)
			{
				if (sch.id_class != classes[i].id)
					tempT1.push_back(sch);
				else
					tempF1.push_back(sch);
			}
			scheduleForGr1 = tempT1;
			vector<schedule>& scheduleForGr2 = schedule2.scheduleForGroups.find(ag.id_group)->second;
			vector<schedule> tempT2, tempF2;
			for (schedule sch : scheduleForGr2)
			{
				if (sch.id_class != classes[i].id)
					tempT2.push_back(sch);
				else
					tempF2.push_back(sch);
			}
			scheduleForGr2 = tempT2;
			if(!tempF2.empty())
			scheduleForGr1.insert(scheduleForGr1.end(), tempF2.begin(), tempF2.end());
			if (!tempF1.empty())
			scheduleForGr2.insert(scheduleForGr2.end(), tempF1.begin(), tempF1.end());
			if(!isFirst)
			{
				isFirst = true;
				for(schedule sch:tempF1)
				{
					id_aud1.insert(sch.id_audience);
				}
				for (schedule sch : tempF2)
				{
					id_aud2.insert(sch.id_audience);
				}
			}
		}
		for(assigned_teacher at: classes[i].assigned_teachers)
		{
			
			vector<schedule>& scheduleForTeach1 = schedule1.scheduleForTeachers.find(at.id_teacher)->second;
			vector<schedule> tempT1, tempF1;
			for (schedule sch : scheduleForTeach1)
			{
				if (sch.id_class != classes[i].id)
					tempT1.push_back(sch);
				else
					tempF1.push_back(sch);
			}
			vector<schedule>& scheduleForTeach2 = schedule2.scheduleForTeachers.find(at.id_teacher)->second;
			vector<schedule> tempT2, tempF2;
			for (schedule sch : scheduleForTeach2)
			{
				if (sch.id_class != classes[i].id)
					tempT2.push_back(sch);
				else
					tempF2.push_back(sch);
			}
			scheduleForTeach1 = tempT1;
			scheduleForTeach2 = tempT2;
			if (!tempF2.empty())
				scheduleForTeach1.insert(scheduleForTeach1.end(), tempF2.begin(), tempF2.end());
			if (!tempF1.empty())
				scheduleForTeach2.insert(scheduleForTeach2.end(), tempF1.begin(), tempF1.end());
		}
		vector <schedule> temp1,temp2;
		for(int id_audience: id_aud1)
		{
			vector<schedule>& scheduleForAud1 = schedule1.scheduleForAudiences.find(id_audience)->second;
			vector<schedule> tempT1, tempF1;
			for(schedule sch:scheduleForAud1)
			{
				if (sch.id_class != classes[i].id)
					tempT1.push_back(sch);
				else
					tempF1.push_back(sch);
			}
			scheduleForAud1 = tempT1;
			if(!tempF1.empty())
			temp1.insert(temp1.end(), tempF1.begin(), tempF1.end());
		}
		for (int id_audience : id_aud2)
		{
			vector<schedule>& scheduleForAud2 = schedule2.scheduleForAudiences.find(id_audience)->second;
			vector<schedule> tempT2, tempF2;
			for (schedule sch : scheduleForAud2)
			{
				if (sch.id_class != classes[i].id)
					tempT2.push_back(sch);
				else
					tempF2.push_back(sch);
			}
			scheduleForAud2 = tempT2;
			if (!tempF2.empty())
			temp2.insert(temp2.end(), tempF2.begin(), tempF2.end());
		}
		
			for (int id_audience : id_aud1)
			{
				vector<schedule>temp;
				if(schedule2.scheduleForAudiences.find(id_audience)== schedule2.scheduleForAudiences.end())
				{
					vector<schedule> t;
					schedule2.scheduleForAudiences[id_audience] = t;
				}

				vector<schedule>& scheduleForAud2 = schedule2.scheduleForAudiences.find(id_audience)->second;
				for (schedule sch : temp1)
				{
					if (sch.id_audience == id_audience)
						temp.push_back(sch);
				}
				if (!temp.empty())
				scheduleForAud2.insert(scheduleForAud2.end(), temp.begin(), temp.end());
			}
			for (int id_audience : id_aud2)
			{
				vector<schedule>temp;
				if (schedule1.scheduleForAudiences.find(id_audience) == schedule1.scheduleForAudiences.end())
				{
					vector<schedule> t;
					schedule1.scheduleForAudiences[id_audience] = t;
				}
				vector<schedule>& scheduleForAud1 = schedule1.scheduleForAudiences.find(id_audience)->second;
				for (schedule sch : temp2)
				{
					if (sch.id_audience == id_audience)
						temp.push_back(sch);
				}
				if (!temp.empty())
				scheduleForAud1.insert(scheduleForAud1.end(), temp.begin(), temp.end());
			}
		}
	
}