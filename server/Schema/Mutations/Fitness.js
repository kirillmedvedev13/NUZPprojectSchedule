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
    for (let clas of classes) {
      let scheduleForClass = [];
      clas.assigned_groups.forEach(ag => {
        scheduleForClass.push(...scheduleData.filter(sc => sc.id_assigned_group === ag.id));
      })
      let number_pair = null;
      let day_week = null;
      let pair_type = null;
      scheduleForClass.forEach(sc => {
      });


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
