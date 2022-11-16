#ifndef MEANFITNESSVALUE_H
#define MEANFITNESSVALUE_H

#include "TypeDefs.h"

double MeanFitnessValue(vector<individ>& populations) {
    double sum = 0;
    for (size_t i = 0; i < populations.size(); i++) {
        sum += populations[i].fitnessValue.fitnessValue;
    }
    return sum / populations.size();
}

#endif
