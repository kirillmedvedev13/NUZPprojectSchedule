import db from "../database.js";
import AddClassToSchedule from "./AddClassToSchedule.js";

//получаем из бд данные расписания занятий для других кафедр в форму
//   schedule = {
//   scheduleForGroups = {id : [ [{1: {clas: clas, isAvailable: true/false} ,2: ,3:} ...max_pair] , isHasPair: true, false ],
//   scheduleForTeachers,
//   scheduleForAudiences,
// };
export default async function ParseScheduleFromDB(schedule, id_cathedra, max_day, max_pair) {
  let classes = await db.class.findAll({
    include: [
      {
        model: db.schedule,
        required: true
      },
      {
        model: db.assigned_group,
      },
      {
        model: db.assigned_teacher,
      },
      {
        model: db.recommended_audience,
      },
      {
        model: db.assigned_discipline,
        required: true,
        include: {
          model: db.specialty,
          required: true,
        },
      },
    ],
  });

  classes = classes.map((cl) => cl.toJSON());

  if (id_cathedra) {
    //если в расписание есть занятие этой кафедры то их удаляем
    let id_schedules = [];
    classes.map((cl) => {
      if (cl.assigned_discipline.specialty.id_cathedra === id_cathedra) {
        for (const sc of cl.schedules) {
          id_schedules.push(sc.id)
        }
      }
    })
    await db.schedule.destroy({ where: { id: id_schedules } });
  }

  // Вставка распсиания в структуру
  for (const cl in classes) {
    AddClassToSchedule(schedule, max_day, max_pair, cl, true)
  }
  // Проставка для каждого занятия id_class
  scheduleData.forEach((sc) => {
    let id_class;
    for (let clas of classes) {
      let id = clas.assigned_groups.find(
        (ag) => ag.id === sc.id_assigned_group
      );
      if (id) {
        id_class = clas.id;
        break;
      }
    }
    sc.id_class = id_class;
  });
  scheduleData.sort(function (a, b) {
    if (a.id_class > b.id_class) return 1;
    if (a.id_class < b.id_class) return -1;
    if (a.day_week > b.day_week) return 1;
    if (a.day_week < b.day_week) return -1;
    if (a.number_pair > b.number_pair) return 1;
    if (a.number_pair < b.number_pair) return -1;
    if (a.pair_type > b.pair_type) return 1;
    if (a.pair_type < b.pair_type) return -1;
    if (a.id_audience > b.id_audience) return 1;
    if (a.id_audience < b.id_audience) return -1;
    return 0;
  });
  let i = 0;
  while (i < scheduleData.length) {
    let id_class = scheduleData[i].id_class;
    let clas = classes.find((cl) => cl.id === id_class);
    AddClassToSchedule(
      schedule,
      clas,
      scheduleData[i].day_week,
      scheduleData[i].number_pair,
      scheduleData[i].pair_type,
      scheduleData[i].id_audience
    );
    i = i + clas.assigned_groups.length;
  }
}
export default function AddClassToSchedule(
  schedule,
  clas,
  day_week,
  number_pair,
  pair_type,
  id_audience
) {
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
      id_class: clas.id,
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
    temp = [];
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
