import GetIdsAudienceForClass from "../Service/GetIdsAudienceForClass.js";
import GetPairTypeForClass from "../Service/GetPairTypeForClass.js";
import GetRndInteger from "../Service/GetRndInteger.js";

// Получить все возможные вставки занятий
function GetAvailableTimeSlots(temp) {
  let timeSlots = [];
  for (let i = 0; i < temp.length; i++) {
    for (let j = 0; j < temp[i].length; j++) {
      for (let k = 1; k <= 3; k++) {
        if (temp[i][j][k].isAvailable) {
          timeSlots.push({ day_week: i, number_pair: j, pair_type: k });
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
        3: { clas: null, isAvailable: true },
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
  max_day,
  max_pair,
  clas,
  id_audience = null
) {
  if (id_audience)
    temp[day_week][number_pair][pair_type].id_audience = id_audience;
  temp[day_week][number_pair][pair_type].clas = clas;
  temp[day_week][number_pair][pair_type].isAvailable = false;
  for (let i = 0; i < max_day; i++) {
    for (let j = 0; j < max_pair; j++) {
      for (let k = 1; k <= 3; k++) {
        // Если пара не занята
        if (!temp[i][j][k].clas) {
          // Накладки
          if ((k === 1 || k === 2) && temp[i][j][3].clas) {
            temp[i][j][k].isAvailable = false;
            continue;
          }
          if (k === 3 && (temp[i][j][1].clas || temp[i][j][2].clas)) {
            temp[i][j][k].isAvailable = false;
            continue;
          }
          // Поиск окон вниз
          for (let h = j - 1; h >= 0; h--) {
            if (
              (k === 1 || k === 3) &&
              (temp[i][h][1].clas || temp[i][h][3].clas) &&
              j - h > 1
            ) {
              temp[i][j][k].isAvailable = false;
              break;
            } else {
              temp[i][j][k].isAvailable = true;
            }
            if (
              (k === 2 || k === 3) &&
              (temp[i][h][2].clas || temp[i][h][3].clas) &&
              j - h > 1
            ) {
              temp[i][j][k].isAvailable = false;
              break;
            } else {
              temp[i][j][k].isAvailable = true;
            }
          }
          // Поиск окон вверх
          for (let h = j + 1; h < max_pair; h++) {
            if (
              (k === 1 || k === 3) &&
              (temp[i][h][1].clas || temp[i][h][3].clas) &&
              h - j > 1
            ) {
              temp[i][j][k].isAvailable = false;
            } else {
              temp[i][j][k].isAvailable = true;
            }
            if (
              (k === 2 || k === 3) &&
              (temp[i][h][2].clas || temp[i][h][3].clas) &&
              h - j > 1
            ) {
              temp[i][j][k].isAvailable = false;
              break;
            } else {
              temp[i][j][k].isAvailable = true;
            }
          }
        }
      }
    }
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
          sc.day_week,
          sc.number_pair,
          sc.pair_type,
          max_day,
          max_pair,
          clas
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
          sc.day_week,
          sc.number_pair,
          sc.pair_type,
          max_day,
          max_pair,
          clas
        );
      }
      schedule.scheduleForTeachers.set(ag.id_teacher, temp_teacher1);
    } else {
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
    temp_audience1 = AddSchedule(
      temp_audience1,
      sc.day_week,
      sc.number_pair,
      sc.pair_type,
      max_day,
      max_pair,
      clas
    );
    schedule.scheduleForAudiences.set(id_audience, temp_audience1);
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

      let getIntersection = (availableTime) => {
        let minLen = Number.MAX_VALUE;
        let index = 0;
        for (let i = 0; i < availableTime.length; i++) {
          if (minLen > availableTime[i].length) {
            minLen = availableTime[i].length;
            index = i;
          }
        }
        let intersection = availableTime[index];
        availableTime.splice(index, 1);
        intersection = intersection.filter((schedule) => {
          let flag = 0;
          availableTime.forEach((group) => {
            for (let pair of group) {
              if (JSON.stringify(schedule) === JSON.stringify(pair)) {
                flag++;
                break;
              }
            }
          });
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
      let id_aud;
      let intersectionAudGroupTeach;
      for (let i = 0; i < available_time_audience.length; i++) {
        intersectionAudGroupTeach = getIntersection([
          intersectionGroupTeacher,
          available_time_audience[i],
        ]);
        if (intersectionAudGroupTeach.length) {
          id_aud = ids_audience[i];
          break;
        }
      }
      if (!intersectionAudGroupTeach.length) {
        console.log();
        return;
      }
      let { day_week, number_pair, pair_type } =
        intersectionAudGroupTeach[
          GetRndInteger(0, intersectionAudGroupTeach.length - 1)
        ];

      // Вставка занятия для групп
      for (let i = 0; i < temp_group.length; i++) {
        let sched = AddSchedule(
          temp_group[i],
          day_week,
          number_pair,
          pair_type,
          max_day,
          max_pair,
          clas,
          id_aud
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
          max_day,
          max_pair,
          clas
        );
        schedule.scheduleForTeachers.set(
          clas.assigned_teachers[i].id_teacher,
          sched
        );
      }
      // Вставка затий для аудитории
      let sched = temp_audience[ids_audience.indexOf(id_aud)];
      schedule.scheduleForAudiences.set(
        id_aud,
        AddSchedule(
          sched,
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
