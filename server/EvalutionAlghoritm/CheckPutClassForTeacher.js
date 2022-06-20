export default function CheckPutClassForTeacher(clas, schedule, day_week, number_pair, pair_type, mapTeacherAndAG) {
    // Поиск всех закрепленных груп для учителя в которых есть какая либо группа для переданого занятия
    let ids_assigned_groups = [];
    for (const at of clas.assigned_teachers) {
        ids_assigned_groups.push(...mapTeacherAndAG.get(at.id_teacher));
    }
    // Поиск нету ли занятий в случаную пару для учителей переданого занятия
    let isSuitableTime = schedule.find((sch) => {
        // Сначалa проверяется подходит ли расписание по номеру пары и дню недели
        if (
            sch.number_pair === number_pair &&
            sch.day_week === day_week
        ) {
            // Поиск текущее расписание имеет ли учителя из переданного занятия?
            const detected_sch = ids_assigned_groups.find(id_ag => sch.id_assigned_group === id_ag);
            // Если текущее расписание касается какого то учителя из переданного занятия
            if (detected_sch) {
                // Если нужно вставить занятие по числ , то проверяется знам в расписании 
                if (pair_type === 1 && sch.pair_type === 2)
                    return false;
                // Если нужно вставить по знамен, то проверяется на числитель
                if (pair_type === 2 && sch.pair_type === 1)
                    return false;
                return true;
            }
        }
        return false;
    });
    // Если в это время нету пар для всех учителей, то возвращается тру
    if (!isSuitableTime) return true
    else return false
}