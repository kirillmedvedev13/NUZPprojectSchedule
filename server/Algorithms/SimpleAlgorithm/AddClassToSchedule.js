function InitDataStructure(max_day, max_pair) {
  temp = [];
  for (let i = 0; i < max_day; i++) {
    temp1 = [];
    for (let j = 0; j < max_pair; j++) {
      temp1[i].push({ 1: null, 2: null, 3: null });
    }
    temp.push({ i: temp1, isFirstPair: false });
  }
  return temp;
}
function GetAvailableTimeSlots(schedule) {
  timeSlots = [];

  for (let i = 0; i < schedule.length; i++) {
    for (let object of Object.entries(schedule[i])) {
    }
  }
}

export default function AddClassToSchedule(schedule, max_day, max_pair, clas) {
  // Для каждой группы добавление расписания
  clas.assigned_groups.forEach((ag) => {
    let temp = schedule.scheduleForGroups.get(ag.id_group);
    if (!temp) {
      temp = InitDataStructure(max_day, max_pair);
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
