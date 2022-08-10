#include "Mutation.h"
#include "GetRndDouble.h"
#include "GetPairTypeForClass.h"
#include <set>
void Mutation(individ &mutant, double p_genes, int max_day, int max_pair, vector<audience> audiences, vector<clas> classes)
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
				vector<schedule>& temp =mutant.scheduleForGroups.find(ag.id_group)->second;
			}

		}
	}
}