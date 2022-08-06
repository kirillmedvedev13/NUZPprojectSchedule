#include "GetIdAudienceForClass.h"
#include "GetRndInteger.h"
#include <iostream>
#include <vector>

using namespace std;

int GetIdAudienceForClass(json clas, json audiences)
{
    vector<int> detected_audiences;
    if (!clas["recommended_audiences"].is_null() && clas["recommended_audiences"].size())
        detected_audiences.push_back(clas["recommended_audiences"][GetRndInteger(0, clas["recommended_audiences"].size())]["id_audience"]);
    else
    {
        int sum_students = 0;
        for (json ag : clas["assigned_groups"])
        {
            sum_students += (int)ag["group"]["number_students"];
        }
        int id_cathedra = clas["assigned_discipline"]["specialty"]["id_cathedra"];

        for (json aud : audiences)
        {
            if (aud["capacity"] >= sum_students && aud["id_type_class"] == clas["id_type_class"])
            {
                for (json au : aud["assigned_audiences"])
                {
                    if (au["id_cathedra"] == id_cathedra)
                    {
                        detected_audiences.push_back(aud["id"]);
                        break;
                    }
                }
            }
        }
        if (!detected_audiences.size())
        {

            for (json aud : audiences)
            {
                if (aud["capacity"] >= sum_students && aud["id_type_class"] == clas["id_type_class"])
                {
                    detected_audiences.push_back(aud["id"]);
                }
            }
            if (!detected_audiences.size())
                return NULL;
        }
    }
    return detected_audiences[GetRndInteger(0, detected_audiences.size() - 1)];
}
