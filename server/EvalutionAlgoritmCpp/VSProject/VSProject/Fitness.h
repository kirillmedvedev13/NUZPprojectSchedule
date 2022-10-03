#ifndef FITNESS_H
#define FITNESS_H
#include "TypeDefs.h"

void Fitness(individ& i_schedule,const vector <recommended_schedule> &recommended_schedules, const int &max_day, const double &penaltySameRecSc, const double &penaltyGrWin, const double &penaltySameTimesSc, const double &penaltyTeachWin);
#endif // FITNESS_H
