#ifndef SERVICE_H
#define SERVICE_H

#include <cstdlib>
using namespace std;

// Диапазон чисел включая обе грааници
int GetRndInteger(int offset, int range)
{
    if (range == 0)
        return 0;
    int r = offset + (rand() % static_cast<int>((range + 1) - offset));
    return r;
}

// Диапазон чисел 0-1
double GetRndDouble()
{
    return (double)rand() / RAND_MAX;
}

// Диапазон чисел включая обе грааници
double GetRndDouble(double min, double max)
{

        // Generate a random number in the range [0, RAND_MAX]
        int randomInt = std::rand();

        // Convert the random number to a double in the range [0, 1]
        double randomDouble = static_cast<double>(randomInt) / RAND_MAX;

        // Scale the random double to the desired range [min, max]
        double scaledDouble = randomDouble * (max - min) + min;

        return scaledDouble;
    }
#endif // SERVICE_H
