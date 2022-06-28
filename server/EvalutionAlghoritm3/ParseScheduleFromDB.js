import db from "../database.js";
import AddClassToSchedule from "./AddClassToSchedule.js";

export default async function ParseScheduleFromDB(schedule) {
  let classes = await db.class.findAll({
    include: [
      {
        model: db.assigned_group,
      },
      {
        model: db.assigned_teacher,
      },
      {
        model: db.recommended_audience,
      },

    ],
  });

  let scheduleData = await db.schedule.findAll();
  scheduleData = scheduleData.map((sc) => sc.toJSON());
  classes = classes.map((cl) => cl.toJSON());

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
