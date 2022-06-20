export default function AddClassToSchedule(schedule, clas, day_week, number_pair, pair_type, id_audience) {
    // Для каждой группы добавление расписания
    clas.assigned_groups.forEach((ag) => {
        let temp = schedule.scheduleForGroups.get(ag.id_group);
        if (!temp) {
            temp = [];
        }
        temp.push({
            number_pair,
            day_week,
            pair_type,
            id_audience,
            id_assigned_group: ag.id,
            id_class: clas.id
        });
        schedule.scheduleForGroups.set(ag.id_group, temp);
    });
    // Для каждого учителя добавление расписания
    clas.assigned_teachers.forEach(at => {
        let temp = schedule.scheduleForTeachers.get(at.id_teacher);
        if (!temp) {
            temp = [];
        }
        temp.push({
            number_pair,
            day_week,
            pair_type,
            id_audience,
            id_class: clas.id
        })
        schedule.scheduleForTeachers.set(at.id_teacher, temp);
    })
    // Для  аудитории добавление расписания
    let temp = schedule.scheduleForAudiences.get(id_audience);
    if (!temp) {
        temp = [];
    }
    temp.push({
        number_pair,
        day_week,
        pair_type,
        id_audience,
        id_class: clas.id
    })
    schedule.scheduleForAudiences.set(id_audience, temp);
}