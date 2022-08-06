#include "GetRndInteger.h"
#include <cstdlib>
int GetRndInteger(int offset, int range)
{
    if (range == 0)
        return 0;
    return offset + (rand() % range);
}
