#include "EvalutionAlgorithm.h"
#include <cstdlib>

int EvalutionAlgorithm::GetRndInteger(int offset, int range)
{
    if (range == 0)
        return 0;
    int r = offset + (rand() % static_cast<int>((range + 1) - offset));
    return r;
}
