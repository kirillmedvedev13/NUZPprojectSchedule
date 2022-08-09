#ifndef FITNESS_H
#define FITNESS_H
#include "TypeDefs.h"

void Fitness(individ& schedule, vector <recommended_schedule> recommended_schedules, int max_day, double penaltySameRecSc, double penaltyGrWin, double penaltySameTimesSc, double penaltyTeachWin);
#endif // FITNESS_H
