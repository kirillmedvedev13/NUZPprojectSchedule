import GetIdAudienceForClass from "../Service/GetIdAudienceForClass";
import GetPairTypeForClass from "../Service/GetPairTypeForClass";

// Получить все возможные вставки занятий
function GetAvailableTimeSlots(temp) {
  timeSlots = [];
  for (let i = 0; i < temp.length; i++) {
    for (let j = 0; j < temp[i].length; j++) {
      for (let k = 0; k < 3; k++) {
        if (temp[i][j][k].isAvailable) {
          timeSlots.push({ day_week: i, number_pair: j, pair_type: k + 1 })
        }
      }
    }
  }
  return timeSlots;
}

function InitDataStructure(max_day, max_pair) {
  temp = [];
  for (let i = 0; i < max_day; i++) {
    temp1 = [];
    for (let j = 0; j < max_pair; j++) {
      temp2 = [];
      for (let k = 0; k < 3; k++) {
        temp2.push({ clas: null, isAvailable: true });
      }
      temp1.push(temp2);
    }
    temp.push(temp1);
  }
  return temp;
}

function AddSchedule(temp, day_week, number_pair, pair_type, max_day, max_pair, clas) {
  temp[day_week - 1].arr[number_pair - 1][pair_type].clas = clas;
  temp[day_week - 1].arr[number_pair - 1][pair_type].isAvailable = false;
  for (let i = 0; i < max_day; i++) {
    for (let j = 0; j < max_pair; j++) {
      for (let k = 1; k <= 3; k++) {
        // Если пара не занята
        if (temp[i][j][k].clas) {
          // Накладки
          if ((k === 1 || k === 2) && temp[i][j][3].clas) {
            temp[i][j][k].isAvailable = false;
            continue;
          }
          else if (k === 3 && (temp[i][j][1].clas || temp[i][j][2].clas)) {
            temp[i][j][k].isAvailable = false;
            continue;
          }
          // Поиск окон вниз
          for (let h = k - 1; h >= 0; h++) {
            if (k === 1 || k === 3) {
              if (temp[i][h][3].clas && k - h > 1) {
                temp[i][j][k].isAvailable = false;
                break;
              }
              if (temp[i][h][1].clas && k - h > 1) {
                temp[i][j][k].isAvailable = false;
                break;
              }
            }
            else if (k === 2 || k === 3) {
              if (temp[i][h][3].clas && k - h > 1) {
                temp[i][j][k].isAvailable = false;
                break;
              }
              if (temp[i][h][2].clas && k - h > 1) {
                temp[i][j][k].isAvailable = false;
                break;
              }
            }
          }
        }
        // Поиск окон вверх
        for (let h = k + 1; h < max_pair; h++) {
          if (k === 1 || k === 3) {
            if (temp[i][h][3].clas && h - k > 1) {
              temp[i][j][k].isAvailable = false;
              break;
            }
            if (temp[i][h][1].clas && h - k > 1) {
              temp[i][j][k].isAvailable = false;
              break;
            }
          }
          else if (k === 2 || k === 3) {
            if (temp[i][h][3].clas && h - k > 1) {
              temp[i][j][k].isAvailable = false;
              break;
            }
            if (temp[i][h][2].clas && h - k > 1) {
              temp[i][j][k].isAvailable = false;
              break;
            }
          }
        }
      }
    }
  }
  return temp;
}

// добавляет в деревья занятие
export default function AddClassToSchedule(schedule, max_day, max_pair, clas, audiences, isNewSchedule = false) {
  let available_time_group = [];
  let available_time_teacher = [];
  let available_time_audience = [];
  // Для каждой группы добавление расписания
  clas.assigned_groups.forEach((ag) => {
    let temp = schedule.scheduleForGroups.get(ag.id_group);
    // Если для группы нету расписания
    if (!temp) {
      temp = InitDataStructure(max_day, max_pair);
    }
    // Если дзанятия были в базе
    if (!isNewSchedule) {
      for (const sc in clas.schedules) {
        temp = AddSchedule(temp, sc.day_week, sc.number_pair, sc.pair_type, max_day, max_pair, clas)
      }
      schedule.scheduleForGroups.set(ag.id_group, temp);
    }
    else {
      available_time_group.push([ag.id_group, GetAvailableTimeSlots(temp)]);
    }
  });
  // Для каждого учителей добавление расписания
  clas.assigned_teachers.forEach((at) => {
    let temp = schedule.scheduleForTeachers.get(at.id_teacher);
    // Если для учителя нету расписания
    if (!temp) {
      temp = InitDataStructure(max_day, max_pair);
    }
    // Если занятия были в базе
    if (!isNewSchedule) {
      for (const sc in clas.schedules) {
        temp = AddSchedule(temp, sc.day_week, sc.number_pair, sc.pair_type, max_day, max_pair, clas)
      }
      schedule.scheduleForTeachers.set(ag.id_teacher, temp);
    }
    else {
      available_time_teacher.push([at.id_teacher, GetAvailableTimeSlots(temp)]);
    }
  });
  // Получения адуитории для занятия
  let id_audience = GetIdAudienceForClass(clas, audiences);
  let temp = schedule.scheduleForAudiences.get(id_audience);
  // Если для аудитории нету расписания
  if (!temp) {
    temp = InitDataStructure(max_day, max_pair);
  }
  // Если занятия были в базе
  if (!isNewSchedule) {
    // Если занятия были в базе Для каждой аудитории добавление расписания
    let temp = schedule.scheduleForTeachers.get(sc.id_audience);
    temp = AddSchedule(temp, sc.day_week, sc.number_pair, sc.pair_type, max_day, max_pair, clas)
    schedule.scheduleForTeachers.set(ag.id_teacher, temp);
  }
  else {
    available_time_audience.push([at.id_teacher, GetAvailableTimeSlots(temp)]);
  }
  // Выбор данных для вставки расписания
  const arr_pair_type = GetPairTypeForClass(clas);
  for (let i = 0; i < arr_pair_type.length; i++) {
    // Получение свободной пары для групп
    let day_week_group = [];
    let number_pair_group = [];
    for (let j = 0; j < available_time_group.length; j++) {
      for (let k = j + 1; k < available_time_group.length; k++) {
        if (available_time_group[j][1].day_week === available_time_group[k][1].day_week
          && available_time_group[j][1].number_pair === available_time_group[k][1].number_pair
          && available_time_group[j][1].pair_type === arr_pair_type[i]
          && available_time_group[k][1].pair_type === arr_pair_type[i]) {
          day_week_group.push(available_time_group[j][1].day_week);
          number_pair_group.push(available_time_group[j][1].number_pair);
        }
      }
    }
  }
}
