#include "MeanFitnessValue.h"
double MeanFitnessValue(vector<individ>& populations, int begin, int end) {
	double sum = 0;
	for (int i = begin; i < end; i++) {
		sum += populations[i].fitnessValue.fitnessValue;
	}
	double length = end - begin;
	return sum / length;
}