import db from "../../database.js";
import Fitness from "../../EvalutionAlghoritm2/Fitness.js";
import GetMapGroupAndAG from "../../EvalutionAlghoritm/GetMapGroupAndAG.js";
import GetMapTeacherAndAG from "../../EvalutionAlghoritm/GetMapTeacherAndAG.js";
import MessageType from "../TypeDefs/MessageType.js";
import AddClassToSchedule from "../../EvalutionAlghoritm2/AddClassToSchedule.js";
import replacer from "../../EvalutionAlghoritm2/JSONReplacer.js";

export const CALC_FITNESS = {
  type: MessageType,
  async resolve(parent) {
    const info = await db.info.findAll();
    const penaltyGrWin = info[0].dataValues.penaltyGrWin;
    const penaltyTeachWin = info[0].dataValues.penaltyTeachWin;
    const penaltyLateSc = info[0].dataValues.penaltyLateSc;
    const penaltyEqSc = info[0].dataValues.penaltyEqSc;
    const penaltySameTimesSc = info[0].dataValues.penaltySameTimesSc;
    const classes = await db.class.findAll({
      include: [
        {
          model: db.assigned_group,
          include: {
            model: db.group,
          },
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
          required: true,
          include: {
            model: db.specialty,
            required: true,
          },
        },
      ],
    });
    const groups = await db.group.findAll();
    const teachers = await db.teacher.findAll({
      include: {
        model: db.assigned_teacher,
      },
    });
    let scheduleData = await db.schedule.findAll({
      include: [
        {
          model: db.assigned_group,
          include: [
            {
              model: db.class,
              include: [
                {
                  model: db.type_class,
                },
                {
                  model: db.assigned_discipline,

                  include: [
                    {
                      model: db.discipline,
                    },
                    {
                      model: db.specialty,
                      include: {
                        model: db.cathedra,
                      },
                    },
                  ],
                },
                {
                  model: db.assigned_teacher,
                  include: {
                    model: db.teacher,
                    include: {
                      model: db.cathedra,
                    },
                  },
                },
              ],
            },
            {
              model: db.group,
              include: {
                model: db.specialty,
                include: {
                  model: db.cathedra,
                },
              },
            },
          ],
        },
        {
          model: db.audience,
        },
      ],
    });
    let scheduleForGroups = new Map();
    let scheduleForTeachers = new Map();
    let scheduleForAudiences = new Map();
    let schedule = {
      scheduleForGroups,
      scheduleForTeachers,
      scheduleForAudiences,
      fitnessValue: null,
    };
    scheduleData = scheduleData.map((s) => {
      return Object.assign(s.toJSON(), {
        clas: classes.filter((cl) => cl.id === s.assigned_group.class.id)[0]
          .dataValues,
      });
    });
    for (let sch of scheduleData) {
      AddClassToSchedule(
        schedule,
        sch.clas,
        sch.day_week,
        sch.number_pair,
        sch.pair_type,
        sch.audience.id
      );
    }
    let fitnessValue = Fitness(
      JSON.stringify(schedule, replacer),
      penaltyGrWin,
      penaltySameTimesSc,
      penaltyTeachWin
    );
    let stringFitness = `Фітнес значення: 
    Загальне - ${fitnessValue.fitnessValue}
    Групи: вікна - ${fitnessValue.fitnessGr.fitnessGrWin},
           накладки - ${fitnessValue.fitnessGr.fitnessSameTimesSc},
           загальне - ${fitnessValue.fitnessGr.fitnessValue}
    Викладачів: вікна - ${fitnessValue.fitnessTeach.fitnessTeachWin},
           накладки - ${fitnessValue.fitnessTeach.fitnessSameTimesSc},
           загальне - ${fitnessValue.fitnessTeach.fitnessValue}`;
    const res = await db.info.update(
      { fitness_value: JSON.stringify(stringFitness) },
      { where: { id: 1 } }
    );
    return res[0]
      ? {
          successful: true,
          message: stringFitness,
        }
      : { successful: false, message: "Помилка при рахуванні значення" };
  },
};
