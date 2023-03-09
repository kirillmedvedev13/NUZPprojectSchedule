#ifndef SERVICE_H
#define SERVICE_H

#include <cstdlib>
using namespace std;


int GetRndInteger(int offset, int range)
{
    if (range == 0)
        return 0;
    int r = offset + (rand() % static_cast<int>((range + 1) - offset));
    return r;
}
//___________________________________________________

double GetRndDouble()
{
    return (double)rand() / RAND_MAX;
}

#endif // SERVICE_H
