#include "Mutation.h"
#include "GetRndDouble.h"
#include "GetPairTypeForClass.h"
#include "GetIdAudienceForClass.h"
#include "AddClassToSchedule.h"
#include "GetRndInteger.h"
#include <set>
void Mutation(individ& mutant, const double& p_genes, const int& max_day, const int& max_pair, const vector<audience>& audiences, const vector<clas>& classes)
{
	for(clas cl: classes)
	{
		if(GetRndDouble()<p_genes)
		{
			vector<int> pair_types = GetPairTypeForClass(cl);
			bool isFirst = false;
			set <int> ids_audiences;
			for(assigned_group ag: cl.assigned_groups)
			{
				vector<schedule>& scheduleForGr =mutant.scheduleForGroups.find(ag.id_group)->second;
				vector<schedule> temp;
				for(const schedule &sch: scheduleForGr)
				{
					if (cl.id != sch.id_class)
						temp.push_back(sch);
					if (!isFirst)
						ids_audiences.insert(sch.id_audience);
				}
				isFirst = true;
				scheduleForGr = temp;
			}
			for(assigned_teacher at:cl.assigned_teachers)
			{
				vector<schedule>& scheduleForTeach = mutant.scheduleForTeachers.find(at.id_teacher)->second;
				vector<schedule> temp;
				for (const schedule &sch : scheduleForTeach)
				{
					if (cl.id != sch.id_class)
						temp.push_back(sch);
				}
				scheduleForTeach = temp;
			}
			for(int id_audience: ids_audiences)
			{
				vector<schedule>& scheduleForAud = mutant.scheduleForAudiences.find(id_audience)->second;
				vector<schedule> temp;
				for (const schedule &sch : scheduleForAud)
				{
					if (cl.id != sch.id_class)
						temp.push_back(sch);
				}
				scheduleForAud = temp;
			}
			for(int i = 0;i<pair_types.size();i++)
			{
				int pair_type = pair_types[i];
				bool checkAud = false, checkTeach = false, checkGroup = false;
				int day_week, number_pair, id_audience;
				if(!cl.recommended_schedules.empty())
				{
					day_week = cl.recommended_schedules[i].day_week;
					number_pair =cl.recommended_schedules[i].number_pair;
				}
				else
				{
					day_week = GetRndInteger(1, max_day);
					number_pair = GetRndInteger(1, max_pair);
				}
				id_audience = GetIdAudienceForClass(cl, audiences);
				AddClassToSchedule(mutant, cl, day_week, number_pair, pair_type, id_audience);
			}

		}
	}
}