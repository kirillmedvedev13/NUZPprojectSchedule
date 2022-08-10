#include "MinFitnessValue.h"
individ MinFitnessValue(vector<individ>& populations, int start, int end)
{
	double min = INT_MAX;
	individ minIndivid;
	for(int i = start;i<end;i++)
	{
		if(populations[i].fitnessValue.fitnessValue<min)
		{
			minIndivid = populations[i];
			min = populations[i].fitnessValue.fitnessValue;
		}
	}
	
	return minIndivid;
}