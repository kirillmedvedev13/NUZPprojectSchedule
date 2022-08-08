#ifndef INIT_H
#define INIT_H
#include "TypeDefs.h"
#include <vector>
using namespace std;

void Init(vector <individ> &populations, vector <clas> classes, int population_size, int max_day, int max_pair, vector<audience> audiences, json base_schedule);

#endif // INIT_H
