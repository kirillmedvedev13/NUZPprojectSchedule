export default function (clas, schedule, day_week, number_pair, pair_type, mapGroupAndAG) {
    // Поиск всех закрепленных груп в которых есть какая либо группа для переданого занятия
    let ids_assigned_groups = [];
    for (const ag of clas.assigned_groups) {
        ids_assigned_groups.push(...mapGroupAndAG.get(ag.id_group));
    }
    // Поиск нету ли занятий в случаную пару для групп переданого занятия
    let wrongSchedules = schedule.filter((sch) => {
        // Сначало проверяется подходит ли расписание по номеру пары и дню недели
        if (
            sch.number_pair === number_pair &&
            sch.day_week === day_week
        ) {
            // Поиск текущее расписание имеет ли группу из переданного занятия?
            const detected_sch = ids_assigned_groups.find(id_ag => sch.id_assigned_group === id_ag);
            // Если текущее расписание касается какой то группы из переданного занятия
            if (detected_sch) {
                // Если нужно вставить занятие по числ , то проверяется знам в расписании 
                if (pair_type === 1 && sch.pair_type === 2)
                    return false;
                // Если нужно вставить по знамен, то проверяется на числитель
                else if (pair_type === 2 && sch.pair_type === 1)
                    return false;
                else
                    return true;
            }
        }
        return false;
    });
    // Если в это время нету пар для всех групп, то возвращается тру
    if (!wrongSchedules.length) return true
    else return false
}