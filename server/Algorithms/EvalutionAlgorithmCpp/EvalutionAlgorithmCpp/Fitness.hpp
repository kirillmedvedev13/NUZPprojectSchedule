#ifndef FITNESS_H
#define FITNESS_H
#include "TypeDefs.h"

void Fitness(individ *i_schedule, const int& max_day, const vector<clas> &classes, const int &index,  const double& penaltySameRecSc, const double& penaltyGrWin, const double& penaltySameTimesSc, const double& penaltyTeachWin);
#endif // FITNESS_H
