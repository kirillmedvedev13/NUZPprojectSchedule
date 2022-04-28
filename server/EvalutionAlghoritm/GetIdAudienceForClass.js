import GetRndInteger from "./GetRndInteger.js";

export default function(clas, audiences){
    const id_cathedra = clas.assigned_discipline.specialty.id_cathedra;
    const type_class = clas.id_type_class;
    let detected_audiences = [];
    // Поиск аудиторий у которых закреплены нужные кафедры
    detected_audiences = audiences.filter((aud) => {
        let isFindCathedra = false;
        aud.assigned_audiences.map(au => {
            if(au.id_cathedra === id_cathedra && aud.id_type_class === clas.id_type_class){
                isFindCathedra = true;
            }
        });
        if(isFindCathedra){
            return true;
        }
        else{
            return false;
        }
    })
    // Если в списке всех аудиторий нашлась хоть одна подходящяя с кафедрой и типом, то возвращаем её ид
    if(detected_audiences.length){
        return detected_audiences[GetRndInteger(0, detected_audiences.length-1)].id;
    }
    // Если не найдена ни одна адутитория за кафедрой, то выбираем случайную из всех по типу
    else{
        detected_audiences = audiences.filter(aud => {
            if(aud.id_type_class === clas.id_type_class){
                return true;
            }
        })
        if (!detected_audiences.length){
            return 0;
        }
        return detected_audiences[GetRndInteger(0, detected_audiences.length-1)].id;
    }
}