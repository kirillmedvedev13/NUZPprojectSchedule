#include "SortPopulations.h"
void SortPopulations(vector<individ>& populations)
{
	sort(populations.begin(), populations.end(), [](individ sc1,individ sc2)
		{
			return sc1.fitnessValue.fitnessValue < sc2.fitnessValue.fitnessValue;
		});
}