import db from "../../database.js";
import Fitness from "../../EvalutionAlghoritm2/Fitness.js";
import MessageType from "../TypeDefs/MessageType.js";
import AddClassToSchedule from "../../EvalutionAlghoritm2/AddClassToSchedule.js";
import replacer from "../../EvalutionAlghoritm2/JSONReplacer.js";

export const CALC_FITNESS = {
  type: MessageType,
  async resolve(parent) {
    const info = await db.info.findOne();
    const penaltyGrWin = info.dataValues.penaltyGrWin;
    const penaltyTeachWin = info.dataValues.penaltyTeachWin;
    const penaltySameTimesSc = info.dataValues.penaltySameTimesSc;
    const penaltySameRecSc = info.dataValues.penaltySameRecSc;
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
        {
          model: db.recommended_schedule,
        },
      ],
    });
    let recommended_schedules = await db.recommended_schedule.findAll();
    let scheduleData = await db.schedule.findAll();
    let scheduleForGroups = new Map();
    let scheduleForTeachers = new Map();
    let scheduleForAudiences = new Map();
    let schedule = {
      scheduleForGroups,
      scheduleForTeachers,
      scheduleForAudiences,
      fitnessValue: null,
    };
    scheduleData = scheduleData.map(sc => sc.toJSON());
    classes = classes.map(cl => cl.toJSON());
    recommended_schedules = recommended_schedules.map(rs => rs.toJSON());
    scheduleData.forEach(sc => {
      let id_class;
      for (let clas of classes) {
        let id = clas.assigned_groups.find(ag => ag.id === sc.id_assigned_group);
        if (id) {
          id_class = clas.id;
          break;
        }
      }
      sc.id_class = id_class;
    })
    scheduleData.sort(function (a, b) {
      if (a.id_class > b.id_class)
        return 1;
      if (a.id_class < b.id_class)
        return -1;
      if (a.day_week > b.day_week)
        return 1;
      if (a.day_week < b.day_week)
        return -1;
      if (a.number_pair > b.number_pair)
        return 1;
      if (a.number_pair < b.number_pair)
        return -1;
      if (a.pair_type > b.pair_type)
        return 1;
      if (a.pair_type < b.pair_type)
        return -1;
      if (a.id_audience > b.id_audience)
        return 1;
      if (a.id_audience < b.id_audience)
        return -1;
      return 0;
    })
    let i = 0;
    while (i < scheduleData.length) {
      let id_class = scheduleData[i].id_class;
      let clas = classes.find(cl => cl.id === id_class);
      AddClassToSchedule(schedule, clas, scheduleData[i].day_week, scheduleData[i].number_pair, scheduleData[i].pair_type, scheduleData[i].id_audience);
      i = i + clas.assigned_groups.length;
    }
    let fitnessValue = Fitness(
      JSON.stringify(schedule, replacer),
      recommended_schedules,
      penaltySameRecSc,
      penaltyGrWin,
      penaltySameTimesSc,
      penaltyTeachWin
    );
    let stringFitness = `Загальна сума - ${fitnessValue.fitnessValue}
\nРек. час - ${fitnessValue.fitnessSameRecSc}
\nГрупи: 
\n\tВікна - ${fitnessValue.fitnessGr.fitnessGrWin}
\n\tНакладки - ${fitnessValue.fitnessGr.fitnessSameTimesSc}
\n\tСума - ${fitnessValue.fitnessGr.fitnessValue}
\nВикладачi: 
\n\tВікна - ${fitnessValue.fitnessTeach.fitnessTeachWin}
\n\tНакладки - ${fitnessValue.fitnessTeach.fitnessSameTimesSc}
\n\tСума - ${fitnessValue.fitnessTeach.fitnessValue}
\nАудиторії: 
\n\tНакладки - ${fitnessValue.fitnessAud.fitnessSameTimesSc}
\n\tСума - ${fitnessValue.fitnessAud.fitnessValue}`;
    const res = await db.info.update(
      { fitness_value: stringFitness },
      { where: { id: 1 } }
    );
    return res[0]
      ? {
        successful: true,
        message: "Значення пораховано успішно",
      }
      : { successful: false, message: "Помилка при рахуванні значення" };
  },
};
