#include "GetIdAudienceForClass.h"
#include "GetRndInteger.h"
#include <iostream>

int GetIdAudienceForClass(clas clas, vector<audience> audiences)
{
    vector<int> detected_audiences;
    if (clas.recommended_audiences.size())
        detected_audiences.push_back(clas.recommended_audiences[GetRndInteger(0, clas.recommended_audiences.size())].id_audience);
    else
    {
        int sum_students = 0;
        for (assigned_group ag : clas.assigned_groups)
        {
            sum_students += ag.a_group.number_students;
        }
        int id_cathedra = clas.cl_assigned_discipline.ad_specialty.id_cathedra;

        for (audience aud : audiences)
        {
            if (aud.capacity >= sum_students && aud.id_type_class == clas.id_type_class)
            {
                for (assigned_audience au : aud.assigned_audiences)
                {
                    if (au.id_cathedra == id_cathedra)
                    {
                        detected_audiences.push_back(aud.id);
                        break;
                    }
                }
            }
        }
        if (!detected_audiences.size())
        {

            for (audience aud : audiences)
            {
                if (aud.capacity >= sum_students && aud.id_type_class == clas.id_type_class)
                {
                    detected_audiences.push_back(aud.id);
                }
            }
            if (!detected_audiences.size())
                return NULL;
        }
    }
    return detected_audiences[GetRndInteger(0, detected_audiences.size() - 1)];
}
