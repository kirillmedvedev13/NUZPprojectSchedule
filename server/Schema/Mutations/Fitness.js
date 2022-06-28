import db from "../../database.js";
import Fitness from "../../EvalutionAlghoritm2/Fitness1.js";
import MessageType from "../TypeDefs/MessageType.js";
import replacer from "../../EvalutionAlghoritm2/JSONReplacer.js";
import ParseScheduleFromDB from "../../EvalutionAlghoritm2/ParseScheduleFromDB.js";

export const CALC_FITNESS = {
  type: MessageType,
  async resolve(parent) {
    const info = await db.info.findOne();
    const penaltyGrWin = info.dataValues.penaltyGrWin;
    const penaltyTeachWin = info.dataValues.penaltyTeachWin;
    const penaltySameTimesSc = info.dataValues.penaltySameTimesSc;
    const penaltySameRecSc = info.dataValues.penaltySameRecSc;
    const max_day = info.dataValues.max_day;
    let recommended_schedules = await db.recommended_schedule.findAll();
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
    await ParseScheduleFromDB(schedule);
    let fitnessValue = Fitness(
      JSON.stringify(schedule, replacer),
      recommended_schedules,
      max_day,
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
