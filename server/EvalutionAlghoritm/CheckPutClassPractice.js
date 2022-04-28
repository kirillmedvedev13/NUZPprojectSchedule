export default function (id_group, schedule, day_week, number_pair, pair_type, mapGroupAndAG) {
    // Поиск всех закрепленных груп в которых есть какая либо группа для переданого занятия
    let ids_assigned_groups = [...mapGroupAndAG.get(id_group)];
    // Поиск нету ли занятий в случаную пару для групп переданого занятия
    let wrongSchedules = schedule.filter((sch) => {
        // Сначало проверяется подходит ли расписание по номеру пары и дню недели
        if (
            sch.number_pair === number_pair &&
            sch.id_day_week === day_week
        ) {
            // Поиск текущее расписание имеет ли группу из переданного занятия?
            const detected_sch = ids_assigned_groups.find(id_ag => sch.id_assigned_group === id_ag);
            // Если текущее расписание касается переданной группы
            if (detected_sch) {
                // Если нужно вставить занятие по числ или знамен, то проверяется общая в расписании 
                if (
                    (pair_type === 1 || pair_type === 2) &&
                    sch.id_pair_type === 3
                ) {
                    return true;
                }
                // Если нужно вставить по общему, то проверяется на числитель или знаменатель
                if (
                    pair_type === 3 &&
                    (sch.id_pair_type === 1 || sch.id_pair_type === 2)
                ) {
                    return true;
                }
            }
        }
        return false;
    });
    // Если в это время нету пар для всех групп, то возвращается тру
    if (!wrongSchedules.length) return true
    else return false
}