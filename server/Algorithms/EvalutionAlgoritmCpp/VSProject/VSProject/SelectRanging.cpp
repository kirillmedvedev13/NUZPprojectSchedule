#include "SelectRanging.h"
#include "GetRndDouble.h"
int SelectRanging(const vector<double>& p_populations)
{
	int left = 0;
	int right = p_populations.size()-1;
	size_t middle=0;
	double rand = GetRndDouble();
	while(left<=right)
	{
		middle = (int)((left + right) / 2);
		if (rand >= p_populations[middle] && rand < p_populations[middle + 1])
			break;
		else if (rand < p_populations[middle])
			right = middle - 1;
		else if (rand >= p_populations[middle + 1])
			left = middle + 1;
	}
	return middle;

}