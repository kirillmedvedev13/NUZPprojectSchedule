import db from "../../database.js";
import AddClassToSchedule from "./AddClassToSchedule.js"

//получаем из бд данные расписания занятий для других кафедр
export default async function ParseScheduleFromDB(id_cathedra, max_day, max_pair, audiences) {
  let scheduleForGroups = new Map();
  let scheduleForTeachers = new Map();
  let scheduleForAudiences = new Map();
  let schedule = {
    scheduleForGroups,
    scheduleForTeachers,
    scheduleForAudiences,
  };
  //если в расписание есть занятие этой кафедры то их удаляем
  if (id_cathedra) {
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
    let id_schedules = [];
    classes.map((cl) => {
      if (cl.assigned_discipline.specialty.id_cathedra === id_cathedra) {
        for (const sc of cl.schedules) {
          id_schedules.push(sc.id)
          // Вставка расписания в структуру
          AddClassToSchedule(schedule, max_day, max_pair, cl, audiences, false)
        }
      }
    })
    await db.schedule.destroy({ where: { id: id_schedules } });
  }
  // Если кафедра не указана, то удаляеми всё расписание
  else {
    await db.schedule.destroy({ where: {}, truncate: true })
  }
  return schedule;
}