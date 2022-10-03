// Получить все возможные вставки занятий
function GetAvailableTimeSlots(schedule) {
  timeSlots = [];
  for (let i = 0; i < schedule.length; i++) {
    for (let j = 0; j < schedule[i].arr.length; j++) {
      // Если в этот день вообще нету пар
      if (!schedule[i].isHasPair) {

      }
      // Если есть пары
      else {

      }
    }
  }
}

export default function AddClassToSchedule(schedule, max_day, max_pair, clas) {
  // Для каждой группы добавление расписания
  clas.assigned_groups.forEach((ag) => {
    let temp = schedule.scheduleForGroups.get(ag.id_group);
    // Если для группы нету занятий
    if (!temp) {
      temp = InitDataStructure(max_day, max_pair);
    }
    // Если для группы уже есть занятия
    else {

    }
    temp.push({
      number_pair,
      day_week,
      pair_type,
      id_audience,
      id_assigned_group: ag.id,
      id_class: clas.id,
    });
    schedule.scheduleForGroups.set(ag.id_group, temp);
  });
  // Для каждого учителя добавление расписания
  clas.assigned_teachers.forEach((at) => {
    let temp = schedule.scheduleForTeachers.get(at.id_teacher);
    if (!temp) {
      temp = InitDataStructure(max_day, max_pair);
    }
    temp.push({
      number_pair,
      day_week,
      pair_type,
      id_audience,
      id_class: clas.id,
    });
    schedule.scheduleForTeachers.set(at.id_teacher, temp);
  });
  // Для  аудитории добавление расписания
  let temp = schedule.scheduleForAudiences.get(id_audience);
  if (!temp) {
    temp = InitDataStructure(max_day, max_pair);
  }
  temp.push({
    number_pair,
    day_week,
    pair_type,
    id_audience,
    id_class: clas.id,
  });
  schedule.scheduleForAudiences.set(id_audience, temp);
}
