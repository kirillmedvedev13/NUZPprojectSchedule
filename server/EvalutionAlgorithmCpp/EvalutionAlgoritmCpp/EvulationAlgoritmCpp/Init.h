#ifndef INIT_H
#define INIT_H
#include "json.hpp"
#include <vector>
using namespace std;
using namespace nlohmann;

void Init(json &populations,json classes, int population_size, int max_day, int max_pair, json audiences, json base_schedule);

#endif // INIT_H
