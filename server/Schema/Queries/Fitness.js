import db from "../../database.js";
import fitness from "../../EvalutionAlghoritm/FitnessFunction.js";
import GetMapGroupAndAG from "../../EvalutionAlghoritm/GetMapGroupAndAG.js";
import GetMapTeacherAndAG from "../../EvalutionAlghoritm/GetMapTeacherAndAG.js";
import MessageType from "../TypeDefs/MessageType.js";
import { GET_INFO } from "./Info.js";
import { GET_ALL_SCHEDULE_GROUPS } from "./Schedule.js";

export const GET_FITNESS = {
  type: MessageType,

  async resolve(parent) {
    const info = await db.info.findAll();
    const p_crossover = info[0].dataValues.p_crossover;
    const p_mutation = info[0].dataValues.p_mutation;
    const p_genes = info[0].dataValues.p_genes;
    const penaltyGrWin = info[0].dataValues.penaltyGrWin;
    const penaltyTeachWin = info[0].dataValues.penaltyTeachWin;
    const penaltyLateSc = info[0].dataValues.penaltyLateSc;
    const penaltyEqSc = info[0].dataValues.penaltyEqSc;
    const penaltySameTimesSc = info[0].dataValues.penaltySameTimesSc;
    const classes = await db.class.findAll({
      include: [
        {
          model: db.assigned_group,
          required: true,
          include: {
            model: db.group,
            required: true,
          },
        },
        {
          model: db.assigned_teacher,
          required: true,
        },
        {
          model: db.recommended_audience,
          required: true,
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
    // Структура для каждой группы массив закрепленных для неё занятий
    let mapGroupAndAG = GetMapGroupAndAG(groups, classes);
    // Структура для каждого учителя массив закрепленных для него занятий
    let mapTeacherAndAG = GetMapTeacherAndAG(teachers, classes);
    let schedule = await db.schedule.findAll({
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
    schedule = schedule.map((s) => {
      let new_object = s.toJSON();
      new_object.clas = new_object.assigned_group.class;
      return new_object;
    });
    let fitnessValue = fitness(schedule, {
      mapTeacherAndAG,
      mapGroupAndAG,
      penaltyGrWin,
      penaltyLateSc,
      penaltyEqSc,
      penaltySameTimesSc,
      penaltyTeachWin,
    });
    console.log(fitnessValue);
    return true
      ? {
          successful: true,
          message: "Фітнес значення розкладу - " + fitnessValue,
        }
      : { successful: false, message: "Помилка при рахуванні значення" };
  },
};
