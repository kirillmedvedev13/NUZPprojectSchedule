#include "GetPairTypeForClass.h"
#include "GetRndDouble.h"
#include "GetRndInteger.h"

vector<int> GetPairTypeForClass(json clas)
{
    vector<int> times;
    int times_per_week = clas["times_per_week"];
    if (times_per_week <= 1)
        times.push_back(GetRndInteger(1, 2));

    if (times_per_week > 1 && times_per_week <= 2)
    {
        times.push_back(GetRndInteger(1, 2));
        times.push_back(GetRndInteger(1, 2));
    }
    if (times_per_week > 2 && times_per_week <= 3)
    {
        double r = GetRndDouble();
        if (r <= 0.75)
        {
            times.push_back(3);
            times.push_back(GetRndInteger(1, 2));
        }
        else
        {
            times.push_back(GetRndInteger(1, 2));
            times.push_back(GetRndInteger(1, 2));
            times.push_back(GetRndInteger(1, 2));
        }
    }
    return times;
}
// 0.5 - 1 пара в 2 денели
// 1 - 1 пара в 2 денели
// 2 - 2 пары в 2 денели
// 2.5 - 3 пары в 2 недели
// 3 - 3 пары в 2 денели
// 4 - 4 пары в 2 недели
