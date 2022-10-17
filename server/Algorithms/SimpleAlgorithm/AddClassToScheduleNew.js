import GetIdsAudienceForClass from "../Service/GetIdsAudienceForClass.js";
import GetPairTypeForClass from "../Service/GetPairTypeForClass.js";
import GetRndInteger from "../Service/GetRndInteger.js";
import AddSchedule from "./AddSchedule.js"
import InitDataStructure from "./InitDataStructure.js";

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

// Получение свободных пар для всех массивов
function getIntersection(availableTime) {
  let intersection = availableTime.splice(0, 1);

  // Получение одинаковых пар для первого  элемента и остальных

  let tempIntersection = intersection[0].filter((pair_first_element) => {
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
    else return false;
  });

  return tempIntersection;
}

// добавляет в деревья занятие
export default function AddClassToScheduleNew(
  schedule,
  max_day,
  max_pair,
  clas,
  audiences,
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
    temp_group.push(temp_group1);
  });
  // Для каждого учителей добавление расписания
  clas.assigned_teachers.forEach((at) => {
    let temp_teacher1 = schedule.scheduleForTeachers.get(at.id_teacher);
    // Если для учителя нету расписания
    if (!temp_teacher1) {
      temp_teacher1 = InitDataStructure(max_day, max_pair);
    }
    temp_teacher.push(temp_teacher1);
  });
  let ids_audience = null;
  // Получения аудиторий для занятия
  ids_audience = GetIdsAudienceForClass(clas, audiences);
  ids_audience.forEach((id_aud) => {
    let temp_audience1 = schedule.scheduleForAudiences.get(id_aud);
    // Если для аудитории нету расписания
    if (!temp_audience1) {
      temp_audience1 = InitDataStructure(max_day, max_pair);
    }
    temp_audience.push(temp_audience1);
  });
  // Если нужно получить новое расписание для занятия
  // Выбор данных для вставки расписания
  // Выбор данных для вставки расписания
  const arr_pair_type = GetPairTypeForClass(clas);
  for (let i = 0; i < arr_pair_type.length; i++) {
    // Получение массивов расписаний свободных
    let isRunning = true;
    let intersectionAudGroupTeach = [];
    let setWindows = false;
    while (isRunning) {
      let available_time_group = [];
      let available_time_teacher = [];
      let available_time_audience = [];
      for (let temp of temp_group) {
        available_time_group.push(
          GetAvailableTimeSlots(temp, arr_pair_type[i], setWindows)
        );
      }
      for (let temp of temp_teacher) {
        available_time_teacher.push(
          GetAvailableTimeSlots(temp, arr_pair_type[i], setWindows)
        );
      }
      for (let temp of temp_audience) {
        available_time_audience.push(
          GetAvailableTimeSlots(temp, arr_pair_type[i], setWindows)
        );
      }

      // Получение всех доступных занятий для всех групп учителей аудиторий
      for (let i = 0; i < available_time_audience.length; i++) {
        intersectionAudGroupTeach.push(
          getIntersection([
            available_time_audience[i],
            ...available_time_teacher,
            ...available_time_group,
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

      // Если не найдена ни одна свободная пара
      if (!intersectionAudGroupTeach.length) {
        if (setWindows) {
          console.log("!!!");

          isRunning = false;
        }
        setWindows = true;
      } else isRunning = false;
    }
    // Если найдена свободная пара

    let index_audience = GetRndInteger(
      0,
      intersectionAudGroupTeach.length - 1
    );
    let r = GetRndInteger(
      0,
      intersectionAudGroupTeach[index_audience].length - 1
    );
    let day_week = intersectionAudGroupTeach[index_audience][r].day_week;
    let number_pair =
      intersectionAudGroupTeach[index_audience][r].number_pair;
    let pair_type = arr_pair_type[i];
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
