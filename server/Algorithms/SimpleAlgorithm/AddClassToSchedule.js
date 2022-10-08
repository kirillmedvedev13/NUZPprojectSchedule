import GetIdsAudienceForClass from "../Service/GetIdsAudienceForClass.js";
import GetPairTypeForClass from "../Service/GetPairTypeForClass.js";

// Получить все возможные вставки занятий
function GetAvailableTimeSlots(temp) {
  let timeSlots = [];
  for (let i = 0; i < temp.length; i++) {
    for (let j = 0; j < temp[i].length; j++) {
      for (let k = 1; k <= 3; k++) {
        if (temp[i][j][k].isAvailable) {
          timeSlots.push({ day_week: i, number_pair: j, pair_type: k + 1 })
        }
      }
    }
  }
  return timeSlots;
}

function InitDataStructure(max_day, max_pair) {
  let day_weeks = [];
  for (let i = 0; i < max_day; i++) {
    let number_pairs = [];
    for (let j = 0; j < max_pair; j++) {
      number_pairs.push({
        1: { clas: null, isAvailable: true },
        2: { clas: null, isAvailable: true },
        3: { clas: null, isAvailable: true }
      })
    }
    day_weeks.push(number_pairs);
  }
  return day_weeks;
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
export default function AddClassToSchedule(schedule, max_day, max_pair, clas, audiences, isNewSchedule = true) {
  let temp_group = [];
  let temp_teacher = [];
  let temp_audience = [];
  // Для каждой группы добавление расписания
  clas.assigned_groups.forEach((ag) => {
    let temp_group1 = schedule.scheduleForGroups.get(ag.id_group);
    // Если для группы нету расписания
    if (!temp_group1) {
      temp_group1 = InitDataStructure(max_day, max_pair);
    }
    // Если занятия были в базе
    if (!isNewSchedule) {
      for (const sc of clas.schedules) {
        temp_group1 = AddSchedule(temp_group1, sc.day_week, sc.number_pair, sc.pair_type, max_day, max_pair, clas)
      }
      schedule.scheduleForGroups.set(ag.id_group, temp_group1);
    }
    else {
      temp_group.push(temp_group1);
    }
  });
  // Для каждого учителей добавление расписания
  clas.assigned_teachers.forEach((at) => {
    let temp_teacher1 = schedule.scheduleForTeachers.get(at.id_teacher);
    // Если для учителя нету расписания
    if (!temp_teacher1) {
      temp_teacher1 = InitDataStructure(max_day, max_pair);
    }
    // Если занятия были в базе
    if (!isNewSchedule) {
      for (const sc of clas.schedules) {
        temp_teacher1 = AddSchedule(temp_teacher1, sc.day_week, sc.number_pair, sc.pair_type, max_day, max_pair, clas)
      }
      schedule.scheduleForTeachers.set(ag.id_teacher, temp_teacher1);
    }
    else {
      temp_teacher.push(temp_teacher1);
    }
  });
  let ids_audience = null;
  // Если расписание есть
  if (!isNewSchedule) {
    let temp_audience1 = schedule.scheduleForAudiences.get(id_aud);
    if (!temp_audience1) {
      temp_audience1 = InitDataStructure(max_day, max_pair);
    }
    // Если занятия были в базе Для каждой аудитории добавление расписания
    temp_audience1 = AddSchedule(temp_audience1, sc.day_week, sc.number_pair, sc.pair_type, max_day, max_pair, clas)
    schedule.scheduleForAudiences.set(id_audience, temp_audience1);
  }
  // Получения аудиторий для занятия
  else {
    ids_audience = GetIdsAudienceForClass(clas, audiences);
    ids_audience.forEach(id_aud => {
      let temp_audience1 = schedule.scheduleForAudiences.get(id_aud);
      // Если для аудитории нету расписания
      if (!temp_audience1) {
        temp_audience1 = InitDataStructure(max_day, max_pair);
      }
      temp_audience.push(temp_audience1);
    })
  }
  // Если нужно получить новое расписание для занятия
  if (isNewSchedule) {
    // Выбор данных для вставки расписания
    const arr_pair_type = GetPairTypeForClass(clas);
    for (let i = 0; i < arr_pair_type.length; i++) {
      let available_time_group = [];
      let available_time_teacher = [];
      let available_time_audience = [];
      for (let temp of temp_group) {
        available_time_group.push(GetAvailableTimeSlots(temp));
      }
      for (let temp of temp_teacher) {
        available_time_teacher.push(GetAvailableTimeSlots(temp));
      }
      for (let temp of temp_audience) {
        available_time_audience.push(GetAvailableTimeSlots(temp));
      }
      // Получение свободных пар для всех массивов
      let available_slots = [];
      for (let i = 0; i < available_time_audience.length; i++) {
        for (let it = 0; it < available_time_audience[i]; it++)
          for (let j = 0; j < available_time_teacher.length; j++) {
            for (let jt = 0; jt < available_time_teacher[j].length; jt++) {
              for (let k = 0; k < available_time_group.length; j++) {
                for (let kt = 0; kt < available_time_group[k].length; kt++)
                  if (available_time_audience[i][it].day_week === available_time_teacher[j][jt].day_week &&
                    available_time_audience[i][it].pair_type === available_time_teacher[j][jt].pair_type &&
                    available_time_audience[i][it].number_pair === available_time_teacher[j][jt].number_pair &&
                    available_time_teacher[j][jt].day_week === available_time_group[k][kt].day_week &&
                    available_time_teacher[j][jt].pair_type === available_time_group[k][kt].pair_type &&
                    available_time_teacher[j][jt].number_pair === available_time_group[k][kt].number_pair) {
                    available_slots.push({
                      day_week: available_time_group[j][jt].day_week,
                      number_pair: available_time_teacher[j][jt].number_pair,
                      pair_type: available_time_teacher[j][jt].pair_type
                    });
                  }
              }
            }
          }
      }
      console.log(available_slots)
    }
  }
}
