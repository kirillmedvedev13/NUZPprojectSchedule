#include "EvalutionAlgorithm.h"

double EvalutionAlgorithm::MeanFitnessValue() {
    double sum = 0;
    for (size_t i = 0; i < populations.size(); i++) {
        sum += populations[i].fitnessValue.fitnessValue;
    }
    return sum / populations.size();
}
