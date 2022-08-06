#ifndef FITNESS_H
#define FITNESS_H
#include "json.hpp"
using namespace nlohmann;

void Fitness(json &schedule,json recommended_schedules,int max_day,double penaltySameRecSc, double penaltyGrWin, double penaltySameTimesSc,double penaltyTeachWin);
#endif // FITNESS_H
