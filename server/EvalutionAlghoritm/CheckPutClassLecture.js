export default function (classes, clas, schedule, day_week, number_pair, pair_type) {
    // Поиск всех закрепленных груп в которых есть какая либо группа для переданого занятия
    let ids_assigned_groups = [];
    for (const cl of classes) {
        cl.assigned_groups.map(ag => {
            // Поиск в закрепленных групах переданного занятия, совпадение группы со всем расписанием 
            const detected_ag = clas.assigned_groups.find(cur_ag => cur_ag.id_group === ag.id_group);
            if (detected_ag) {
                ids_assigned_groups.push(detected_ag.id);
            }
        })
    }
    // Поиск нету ли занятий в случаную пару для групп переданого занятия
    let wrongSchedules = schedule.filter((sch) => {
        // Сначало проверяется подходит ли расписание по номеру пары и дню недели
        if (
            sch.number_pair === number_pair &&
            sch.id_day_week === day_week
        ) {
            // Поиск текущее расписание имеет ли группу из переданного занятия?
            const detected_sch = ids_assigned_groups.find(id_ag => sch.id_assigned_group === id_ag);
            // Если текущее расписание касается какой то группы из переданного занятия
            if (detected_sch) {
                // Если нужно вставить занятие по числ , то проверяется знам в расписании 
                if (pair_type === 1 && sch.id_pair_type === 2)
                    return false;
                // Если нужно вставить по знамен, то проверяется на числитель
                else if (pair_type === 2 && sch.id_pair_type === 1)
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