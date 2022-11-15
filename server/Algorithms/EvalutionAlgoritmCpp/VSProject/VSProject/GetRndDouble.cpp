#include <cstdlib>
#include "GetRndDouble.h"
double GetRndDouble()
{
    return (double)rand() / RAND_MAX;
}
