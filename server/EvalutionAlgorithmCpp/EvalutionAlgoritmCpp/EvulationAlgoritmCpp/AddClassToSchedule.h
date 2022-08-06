#ifndef ADDCLASSTOSCHEDULE_H
#define ADDCLASSTOSCHEDULE_H
#include "json.hpp"
using namespace nlohmann;
json AddClassToSchedule(json &schedule,json clas,int day_week,int number_pair,int pair_type,int id_audience);
#endif // ADDCLASSTOSCHEDULE_H
