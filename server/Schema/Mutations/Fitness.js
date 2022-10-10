import db from "../../database.js";
import Fitness from "../../Algorithms/Service/Fitness.js";
import MessageType from "../TypeDefs/MessageType.js";

export const CALC_FITNESS = {
  type: MessageType,
  async resolve(parent) {
    const info = await db.info.findOne();
    const general_values = JSON.parse(info.dataValues.general_values);
    const {
      penaltyGrWin,
      penaltyTeachWin,
      penaltySameTimesSc,
      penaltySameRecSc,
    } = general_values;

    const max_day = info.dataValues.max_day;
    let recommended_schedules = await db.recommended_schedule.findAll({
      include: {
        model: db.class,
        include: {
          model: db.schedule,
        },
      },
    });
    recommended_schedules = recommended_schedules.map((rs) => rs.toJSON());
    let scheduleForGroups = new Map();
    let scheduleForTeachers = new Map();
    let scheduleForAudiences = new Map();
    let schedule = {
      scheduleForGroups,
      scheduleForTeachers,
      scheduleForAudiences,
      fitnessValue: null,
    };
    let dataSchedules = await db.schedule.findAll({
      include: [
        {
          model: db.audience,
        },
        {
          model: db.class,
          include: [
            { model: db.recommended_schedule },
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
        },
      ],
    });
    for (let pair of dataSchedules) {
      pair = pair.dataValues;
      let clas = pair.class.dataValues;
      let object = {
        id: pair.id,
        number_pair: pair.number_pair,
        day_week: pair.day_week,
        pair_type: pair.pair_type,
      };
      let schedAud = schedule.scheduleForAudiences.get(pair.audience.id);
      if (!schedAud) schedAud = [];
      schedAud.push(object);
      schedule.scheduleForAudiences.set(pair.audience.id, schedAud);
      for (let group of clas.assigned_groups) {
        group = group.dataValues;
        let schedGroup = schedule.scheduleForGroups.get(group.id_group);
        if (!schedGroup) schedGroup = [];
        schedGroup.push(object);
        schedule.scheduleForGroups.set(group.id_group, schedGroup);
      }
      for (let teach of clas.assigned_teachers) {
        teach = teach.dataValues;
        let schedTeach = schedule.scheduleForTeachers.get(teach.id_teacher);
        if (!schedTeach) schedTeach = [];
        schedTeach.push(object);
        schedule.scheduleForTeachers.set(teach.id_teacher, schedTeach);
      }
    }
    let fitnessValue = Fitness(
      schedule,
      recommended_schedules,
      max_day,
      penaltySameRecSc,
      penaltyGrWin,
      penaltySameTimesSc,
      penaltyTeachWin
    );
    /* let stringFitness = `Загальна сума - ${fitnessValue.fitnessValue}
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
\n\tСума - ${fitnessValue.fitnessAud.fitnessValue}`;*/
    const res = await db.info.update(
      { fitness_value: JSON.stringify(fitnessValue) },
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
