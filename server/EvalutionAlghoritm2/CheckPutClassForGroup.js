export default function CheckPutClassForGroup(schedules, clas, day_week, number_pair, pair_type) {
    // Поиск нету ли занятий в случаную пару для групп переданого занятия
    let isSuitableTime = false;
    for (const ag of clas.assigned_groups) {
        isSuitableTime = schedules.get(ag.id_group).find((sch) => {
            if (sch.day_week === day_week && sch.number_pair === number_pair) {
                // Если нужно вставить занятие по числ, то проверяется знам в расписании 
                if (pair_type === 1 && sch.pair_type === 2)
                    return false;
                // Если нужно вставить по знамен, то проверяется на числитель
                if (pair_type === 2 && sch.pair_type === 1)
                    return false;

                return true;
            }
            return false;
        });
        if (isSuitableTime)
            break;
    }
    // Если в это время нету пар для всех групп, то возвращается тру
    if (isSuitableTime) return false
    else return true
}