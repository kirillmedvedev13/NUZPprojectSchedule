export default function AddClassToSchedule(
  schedule,
  clas,
  day_week,
  number_pair,
  pair_type,
  id_audience,
  id_schedule,
  tabuList
) {
  // Для каждой группы добавление расписания
  // Для каждой группы добавление расписания
  clas.assigned_groups.forEach((ag) => {
    let temp = schedule.scheduleForGroups.get(ag.id_group);
    if (!temp) {
      temp = [];
    }
    temp.push({
      id: id_schedule,
      number_pair,
      day_week,
      pair_type,
      id_audience,
      clas,
    });
    schedule.scheduleForGroups.set(ag.id_group, temp);
  });
  // Для каждого учителя добавление расписания
  clas.assigned_teachers.forEach((at) => {
    let temp = schedule.scheduleForTeachers.get(at.id_teacher);
    if (!temp) {
      temp = [];
    }
    temp.push({
      id: id_schedule,
      number_pair,
      day_week,
      pair_type,
      id_audience,
      clas,
    });
    schedule.scheduleForTeachers.set(at.id_teacher, temp);
  });
  // Для  аудитории добавление расписания
  let temp = schedule.scheduleForAudiences.get(id_audience);
  if (!temp) {
    temp = [];
  }
  temp.push({
    id: id_schedule,
    number_pair,
    day_week,
    pair_type,
    id_audience,
    clas,
  });
  schedule.scheduleForAudiences.set(id_audience, temp);

  temp = tabuList.get(+clas.id);
  if (!temp) temp = new Array();
  temp.push(JSON.stringify({ day_week, number_pair, pair_type }));

  tabuList.set(clas.id, temp);
}