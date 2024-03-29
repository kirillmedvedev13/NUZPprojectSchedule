import db from "../../database.js";
import { Op } from "sequelize";

//получаем из бд данные расписания занятий для других кафедр
export default async function GetBaseSchedule(id_cathedra) {
  //Получение расписания для выбранной кафедры
  let classes = await db.class.findAll({
    include: [
      {
        model: db.schedule,
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
        model: db.recommended_schedule,
      },
      {
        model: db.assigned_discipline,
        include: {
          model: db.specialty,
          where: {
            id_cathedra: {
              [Op.eq]: id_cathedra,
            }
          }
        },
      },
    ],
  });
  classes = classes.map((cl) => cl.toJSON());
  let id_schedules = [];
  classes.map((cl) => {
    for (const sc of cl.schedules) {
      id_schedules.push(sc.id);
    }
  });
  // Удаления расписания для выбранной кафедры
  await db.schedule.destroy({ where: { id: id_schedules } });
  // Получение расписания занятий для учителей групп аудиторий выбранной кафедры из других кафедр
  let db_schedule_group = await db.group.findAll({
    include: [
      {
        model: db.specialty,
        where: { id_cathedra },
      },
      {
        model: db.assigned_group,
        include: {
          model: db.class,
          include: [
            {
              model: db.schedule,
            },
          ],
        },
      },
    ],
  });
  let schedule_group = [];
  for (let gr of db_schedule_group) {
    let schedule = [];
    for (let ag of gr.assigned_groups) {
      for (let sc of ag.class.schedules) {
        schedule.push(Object.assign(sc, { class: ag.class }));
      }
    }
    if (schedule.length) {
      schedule_group.push({ id: gr.id, schedule });
    }
  }
  let db_schedule_teacher = await db.teacher.findAll({
    where: { id_cathedra },
    include: {
      model: db.assigned_teacher,
      include: {
        model: db.class,
        include: {
          model: db.schedule,
        },
      },
    },
  });
  let schedule_teacher = [];
  for (let teach of db_schedule_teacher) {
    let schedule = [];
    for (let at of teach.assigned_teachers) {
      for (let sc of at.class.schedules) {
        schedule.push(Object.assign(sc, { class: at.class }));
      }
    }
    if (schedule.length) {
      schedule_teacher.push({ id: teach.id, schedule });
    }
  }
  let db_schedule_audience = await db.audience.findAll({
    include: {
      model: db.schedule,
    },
  });
  let schedule_audience = [];
  for (let aud of db_schedule_audience) {
    let schedule = [];
    for (let sc of aud.schedules) {
      schedule.push(Object.assign(sc, { class: aud.class }));
    }
    if (schedule.length) {
      schedule_audience.push({ id: aud.id, schedule });
    }
  }
  // Формат данных [{id : , schedule : ['schedule']}]
  return { schedule_group, schedule_teacher, schedule_audience };
}
