import GetIdsAudienceForClass from "../Service/GetIdsAudienceForClass.js";
import GetPairTypeForClass from "../Service/GetPairTypeForClass.js";
import GetRndInteger from "../Service/GetRndInteger.js";

// Получить все возможные вставки занятий для типа пары
function GetAvailableTimeSlots(temp, pair_type) {
  let timeSlots = [];
  for (let i = 0; i < temp.length; i++) {
    for (let j = 0; j < temp[i].length; j++) {
      if (temp[i][j][pair_type].isAvailable) {
        timeSlots.push({ day_week: i, number_pair: j, pair_type });
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
      if (j === 0)
        number_pairs.push({
          1: { clas: [], isAvailable: true },
          2: { clas: [], isAvailable: true },
          3: { clas: [], isAvailable: true },
          firstPairType: null,
        });
      else
        number_pairs.push({
          1: { clas: [], isAvailable: true },
          2: { clas: [], isAvailable: true },
          3: { clas: [], isAvailable: true },
        });
    }
    day_weeks.push(number_pairs);
  }
  return day_weeks;
}

function AddSchedule(
  temp,
  day_week,
  number_pair,
  pair_type,
  max_pair,
  clas,
  id_audience = null
) {
  // Добавление аудитории, для вставки в базу данных
  if (id_audience)
    if (temp[day_week][number_pair][pair_type].ids_audience)
      temp[day_week][number_pair][pair_type].ids_audience.push(id_audience);
    else temp[day_week][number_pair][pair_type].ids_audience = [id_audience];
  temp[day_week][number_pair][pair_type].clas.push(clas);
  temp[day_week][number_pair][pair_type].isAvailable = false;
  temp[day_week][number_pair][3].isAvailable = false;
  if (pair_type === 3) {
    temp[day_week][number_pair][1].isAvailable = false;
    temp[day_week][number_pair][2].isAvailable = false;
  }
  // Проход числитель
  let total_top = new Array(max_pair)
  for (let h = 0; h < max_pair; h++) {
    // Если текущая пара уже есть то не проверять
    if (temp[day_week][h][1].clas.length || temp[day_week][h][3].clas.length)
      continue;
    let next_pair = null;
    let prev_pair = null;
    for (let k = h + 1; k < max_pair; k++) {
      if (temp[day_week][k][1].clas.length || temp[day_week][k][3].clas.length) {
        next_pair = k;
        break;
      }
    }
    for (let k = h - 1; k >= 0; k--) {
      if (temp[day_week][k][1].clas.length || temp[day_week][k][3].clas.length) {
        prev_pair = k;
        break;
      }
    }
    // Проверка на первую пара в этот день
    if (next_pair === null && prev_pair === null) {
      temp[day_week][h][1].isAvailable = true;
      total_top[h] = true;
      continue;
    }
    // Проверка на вставку вниз расписания
    if (prev_pair === null && next_pair - h < 2) {
      temp[day_week][h][1].isAvailable = true;
      total_top[h] = true;
      continue;
    }
    // Проверка на вставку вверх расписания
    if (next_pair === null && h - prev_pair < 2) {
      temp[day_week][h][1].isAvailable = true;
      total_top[h] = true;
      continue;
    }
    // Проверка на вставку между парами
    if (next_pair !== null && prev_pair !== null) {
      if (next_pair - h < 2 && h - prev_pair < 2) {
        temp[day_week][h][1].isAvailable = true;
        total_top[h] = true;
        continue;
      }
    }
    temp[day_week][h][1].isAvailable = false;
    total_top[h] = false;
  }
  // Проход знаменателю
  let total_bot = new Array(max_pair)
  for (let h = 0; h < max_pair; h++) {
    // Если текущая пара уже есть то не проверять
    if (temp[day_week][h][2].clas.length || temp[day_week][h][3].clas.length)
      continue;
    let next_pair = null;
    let prev_pair = null;
    for (let k = h + 1; k < max_pair; k++) {
      if (temp[day_week][k][2].clas.length || temp[day_week][k][3].clas.length) {
        next_pair = k;
        break;
      }
    }
    for (let k = h - 1; k >= 0; k--) {
      if (temp[day_week][k][2].clas.length || temp[day_week][k][3].clas.length) {
        prev_pair = k;
        break;
      }
    }
    // Проверка на первую пара в этот день
    if (next_pair === null && prev_pair === null) {
      temp[day_week][h][2].isAvailable = true;
      total_bot[h] = true;
      continue;
    }
    // Проверка на вставку вниз расписания
    if (prev_pair === null && next_pair - h < 2) {
      temp[day_week][h][2].isAvailable = true;
      total_bot[h] = true;
      continue;
    }
    // Проверка на вставку вверх расписания
    if (next_pair === null && h - prev_pair < 2) {
      temp[day_week][h][2].isAvailable = true;
      total_bot[h] = true;
      continue;
    }
    // Проверка на вставку между парами
    if (next_pair !== null && prev_pair !== null) {
      if (next_pair - h < 2 && h - prev_pair < 2) {
        temp[day_week][h][2].isAvailable = true;
        total_bot[h] = true;
        continue;
      }
    }
    temp[day_week][h][2].isAvailable = false;
    total_bot[h] = false;
  }
  // Проверка общий пар
  for (let h = 0; h < max_pair; h++) {
    temp[day_week][h][3].isAvailable = Boolean(total_bot[h] & total_top[h]);
  }
  return temp;
}

// добавляет в деревья занятие
export default function AddClassToSchedule(
  schedule,
  max_day,
  max_pair,
  clas,
  audiences,
  isNewSchedule = true
) {
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
        temp_group1 = AddSchedule(
          temp_group1,
          sc.day_week - 1,
          sc.number_pair - 1,
          sc.pair_type,
          max_pair,
          clas,
          sc.id_audience
        );
      }
      schedule.scheduleForGroups.set(ag.id_group, temp_group1);
    } else {
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
        temp_teacher1 = AddSchedule(
          temp_teacher1,
          sc.day_week - 1,
          sc.number_pair - 1,
          sc.pair_type,
          max_pair,
          clas
        );
      }
      schedule.scheduleForTeachers.set(at.id_teacher, temp_teacher1);
    } else {
      temp_teacher.push(temp_teacher1);
    }
  });
  let ids_audience = null;
  // Если расписание есть
  if (!isNewSchedule) {
    for (const sc of clas.schedules) {
      let temp_audience1 = schedule.scheduleForAudiences.get(sc.id_audience);
      if (!temp_audience1) {
        temp_audience1 = InitDataStructure(max_day, max_pair);
      }
      // Если занятия были в базе Для каждой аудитории добавление расписания
      temp_audience1 = AddSchedule(
        temp_audience1,
        sc.day_week - 1,
        sc.number_pair - 1,
        sc.pair_type,
        max_pair,
        clas
      );
      schedule.scheduleForAudiences.set(sc.id_audience, temp_audience1);
    }
  }
  // Получения аудиторий для занятия
  else {
    ids_audience = GetIdsAudienceForClass(clas, audiences);
    ids_audience.forEach((id_aud) => {
      let temp_audience1 = schedule.scheduleForAudiences.get(id_aud);
      // Если для аудитории нету расписания
      if (!temp_audience1) {
        temp_audience1 = InitDataStructure(max_day, max_pair);
      }
      temp_audience.push(temp_audience1);
    });
  }
  // Если нужно получить новое расписание для занятия
  if (isNewSchedule) {
    // Выбор данных для вставки расписания
    const arr_pair_type = GetPairTypeForClass(clas);
    for (let i = 0; i < arr_pair_type.length; i++) {
      let available_time_group = [];
      let available_time_teacher = [];
      let available_time_audience = [];
      // Получение массивов расписаний свободных
      for (let temp of temp_group) {
        available_time_group.push(
          GetAvailableTimeSlots(temp, arr_pair_type[i])
        );
      }
      for (let temp of temp_teacher) {
        available_time_teacher.push(
          GetAvailableTimeSlots(temp, arr_pair_type[i])
        );
      }
      for (let temp of temp_audience) {
        available_time_audience.push(
          GetAvailableTimeSlots(temp, arr_pair_type[i])
        );
      }
      // Получение свободных пар для всех массивов
      let getIntersection = (availableTime) => {
        let intersection = availableTime.splice(0, 1);
        // Получение одинаковых пар для первого  элемента и остальных
        intersection = intersection[0].filter((pair_first_element) => {
          let flag = 0;
          availableTime.forEach((element) => {
            for (let pair of element) {
              if (JSON.stringify(pair_first_element) === JSON.stringify(pair)) {
                flag++;
                break;
              }
            }
          });
          // Если у всех есть одинаковое время занятия
          if (flag === availableTime.length) return true;
          return false;
        });
        return intersection;
      };
      let intersectionGroup = getIntersection(available_time_group);
      let intersectionTeacher = getIntersection(available_time_teacher);
      let intersectionGroupTeacher = getIntersection([
        intersectionGroup,
        intersectionTeacher,
      ]);
      let intersectionAudGroupTeach = [];
      // Получение всех доступных занятий для всех групп учителей аудиторий
      for (let i = 0; i < available_time_audience.length; i++) {
        intersectionAudGroupTeach.push(
          getIntersection([
            intersectionGroupTeacher,
            available_time_audience[i],
          ])
        );
      }
      let t = [];
      for (let i = 0; i < intersectionAudGroupTeach.length; i++) {
        // Если для аудитории нету расписания
        if (intersectionAudGroupTeach[i].length) {
          t.push(intersectionAudGroupTeach[i]);
        }
      }
      intersectionAudGroupTeach = t;
      let day_week,
        number_pair,
        pair_type = arr_pair_type[i],
        index_audience;

      // Если не найдена ни одна свободная пара
      if (!intersectionAudGroupTeach.length) {
        continue;
        day_week = GetRndInteger(0, max_day - 1);
        number_pair = GetRndInteger(0, max_day - 1);
        index_audience = GetRndInteger(0, ids_audience.length - 1);
      }
      // Если найдена свободная пара
      else {
        index_audience = GetRndInteger(0, intersectionAudGroupTeach.length - 1);
        let r = GetRndInteger(
          0,
          intersectionAudGroupTeach[index_audience].length - 1
        );
        day_week = intersectionAudGroupTeach[index_audience][r].day_week;
        number_pair = intersectionAudGroupTeach[index_audience][r].number_pair;
      }

      // Вставка занятия для групп
      for (let i = 0; i < temp_group.length; i++) {
        let sched = AddSchedule(
          temp_group[i],
          day_week,
          number_pair,
          pair_type,
          max_pair,
          clas,
          ids_audience[index_audience]
        );
        schedule.scheduleForGroups.set(clas.assigned_groups[i].id_group, sched);
      }
      // Вставка занятий для учителей
      for (let i = 0; i < temp_teacher.length; i++) {
        let sched = AddSchedule(
          temp_teacher[i],
          day_week,
          number_pair,
          pair_type,
          max_pair,
          clas
        );
        schedule.scheduleForTeachers.set(
          clas.assigned_teachers[i].id_teacher,
          sched
        );
      }
      // Вставка затий для аудитории
      schedule.scheduleForAudiences.set(
        ids_audience[index_audience],
        AddSchedule(
          temp_audience[index_audience],
          day_week,
          number_pair,
          pair_type,
          max_day,
          max_pair,
          clas
        )
      );
    }
  }
  return schedule;
}
