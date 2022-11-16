#ifndef GETRNDINTEGER_H
#define GETRNDINTEGER_H

#include <cstdlib>

int GetRndInteger(int offset, int range)
{
    if (range == 0)
        return 0;
    int r = offset + (rand() % static_cast<int>(range - offset));
    return r;
}


#endif // GETRNDINTEGER_H
