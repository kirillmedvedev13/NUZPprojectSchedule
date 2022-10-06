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

function InitDataStructure(max_day, max_pair) {
  temp = [];
  for (let i = 0; i < max_day; i++) {
    temp1 = [];
    for (let j = 0; j < max_pair; j++) {
      temp1.push({ 1: null, 2: null, 3: null });
    }
    temp.push({ arr: temp1, isHasPair: false });
  }
  return temp;
}

function AddSchedule(temp, day_week, number_pair, pair_type, clas) {
  temp[day_week - 1].arr[number_pair - 1][pair_type].clas = clas;
  temp[day_week - 1].arr[number_pair - 1][pair_type].isAvailable = false;
  // Если числитель то общая недоступна
  if (pair_type === 1) {
    temp[day_week - 1][number_pair - 1][3].isAvailable = false;
  }
  // Если знаменатель то общая недоступна
  else if (pair_type === 2) {
    temp[day_week - 1][number_pair - 1][2].isAvailable = false;
  }
  // Если Общая пара то числитель/знаменатель недоступны
  else if (pair_type === 3) {
    temp[day_week - 1][number_pair - 1][1].isAvailable = false;
    temp[day_week - 1][number_pair - 1][2].isAvailable = false;
  }
  // Проход по числителю
  for (let i = 1; i < temp[day_week - 1].arr.length - 1; i++) {
    // Если нету пары на следующей такого типа или общей, то и текущая недоступна
    if (!temp[day_week][i + 1][1].clas || !temp[day_week][i + 1][3].clas) {
      temp[day_week][i][1].isAvailable = false;
    }
    // иначе пара есть  
    else {

    }
    // Если нету пары на предидущей такого типа, то и текущая недоступна
    if (!temp[day_week][i - 1][1].clas) {
      temp[day_week][i][1].isAvailable = false;
    }
  }
}

export default function AddClassToSchedule(schedule, max_day, max_pair, clas, isNewSchedule = true) {
  // Для каждой группы добавление расписания
  clas.assigned_groups.forEach((ag) => {
    let temp = schedule.scheduleForGroups.get(ag.id_group);
    // Если для группы нету занятий
    if (!temp) {
      temp = InitDataStructure(max_day, max_pair);
    }
    // Если для группы уже есть занятия
    else {
      if (!isNewSchedule) {
        for (const sc in clas.schedules) {
          AddSchedule(temp, sc.day_week, sc.number_pair, sc.pair_type, clas.id)
        }
        schedule.scheduleForGroups.set(ag.id_group,);
      }
    }
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
