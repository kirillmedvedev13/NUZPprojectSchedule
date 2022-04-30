import GetRndInteger from "./GetRndInteger.js";

export default function (clas, audiences) {
    // Если есть рекоменд аудитории, то выбирается случайная без доп условий
    if (clas.recommended_audiences?.length) {
        return clas.recommended_audiences[GetRndInteger(0, clas.recommended_audiences.length - 1)].id_audience;
    }
    // Если нету рек аудиторий, то ищется свободная среди кафедр и по типу, если такая не найденна, то выбирается случайная среди всех по типу
    // И проводится доп проверка на ёмкость групп и аудитории для занятия
    else {
        let sum_students = 0;
        clas.assigned_groups.forEach(ag => {
            sum_students += ag.group.number_students;
        })
        const id_cathedra = clas.assigned_discipline.specialty.id_cathedra;
        let detected_audiences = [];
        // Поиск аудиторий у которых закреплены нужные кафедры
        detected_audiences = audiences.filter((aud) => {
            // Если аудитория подходит по ёмкости 
            if (aud.capacity >= sum_students) {
                let isFindCathedra = false;
                aud.assigned_audiences.map(au => {
                    if (au.id_cathedra === id_cathedra && aud.id_type_class === clas.id_type_class) {
                        isFindCathedra = true;
                    }
                });
                if (isFindCathedra)
                    return true;
                else
                    return false;
            }
            // Если аудитория не подходит по ёмкости
            return false;
        })
        // Если в списке всех аудиторий нашлась хоть одна подходящяя с кафедрой, типом и ёмкостью, то возвращаем её ид
        if (detected_audiences.length) {
            return detected_audiences[GetRndInteger(0, detected_audiences.length - 1)].id;
        }
        // Если не найдена ни одна адутитория за кафедрой, то выбираем случайную из всех по типу и ёмкости
        else {
            detected_audiences = audiences.filter(aud => {
                if (aud.id_type_class === clas.id_type_class && aud.capacity >= sum_students) {
                    return true;
                }
            })
            if (!detected_audiences.length) {
                return 0;
            }
            return detected_audiences[GetRndInteger(0, detected_audiences.length - 1)].id;
        }
    }
}