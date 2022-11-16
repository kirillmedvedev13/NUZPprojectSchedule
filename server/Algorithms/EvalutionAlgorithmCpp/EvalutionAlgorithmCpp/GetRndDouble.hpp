#ifndef GETRNDDOUBLE_H
#define GETRNDDOUBLE_H

#include <cstdlib>

double GetRndDouble()
{
    return (double)rand() / RAND_MAX;
}


#endif // GETRNDDOUBLE_H
