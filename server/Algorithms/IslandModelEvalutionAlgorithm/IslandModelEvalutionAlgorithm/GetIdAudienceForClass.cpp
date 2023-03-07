#include "EvalutionAlgorithm.h"

int EvalutionAlgorithm::GetIdAudienceForClass(const clas& clas)
{
    vector<int> detected_audiences;
    if (clas.recommended_audiences.size())
        detected_audiences.push_back(clas.recommended_audiences[GetRndInteger(0, clas.recommended_audiences.size() - 1)].id_audience);
    else
    {
        int sum_students = 0;
        for (auto ag : clas.assigned_groups)
        {
            sum_students += ag.number_students;
        }
        int id_cathedra = clas.id_cathedra;
        // Аудитории в кафедре занятия
        for (const auto &aud : audiences)
        {
            if (aud.capacity >= sum_students && aud.id_type_class == clas.id_type_class)
            {
                for (auto cath : aud.cathedras)
                {
                    if (cath == id_cathedra)
                    {
                        detected_audiences.push_back(aud.id);
                        break;
                    }
                }
            }
        }
        // Если в кафедре нету ни одно аудитории
        if (!detected_audiences.size()){
            for (const auto &aud : audiences){
                if (aud.capacity >= sum_students && aud.id_type_class == clas.id_type_class)
                {
                    detected_audiences.push_back(aud.id);
                }
            }
            if (!detected_audiences.size())
                return -1;
        }
    }
    return detected_audiences[GetRndInteger(0, detected_audiences.size() - 1)];
}
