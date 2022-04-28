import db from "../database.js";
import MessageType from "../Schema/TypeDefs/MessageType.js";
import fitness from "./Fitness.js";
import Init from "./Init.js";

export const RUN_EA = {
  type: MessageType,
  async resolve(parent, { data, id_cathedra }) {
    const info = await db.info.findAll();
    const max_day = info[0].dataValues.max_day;
    const max_pair = info[0].dataValues.max_pair;
    const population_size = 500;
    const p_crossover = 0.9;
    const p_mutation = 0.1;
    const classes = await db.class.findAll({
      include: [
        {
          model: db.assigned_group,
          required: true,
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
    const audiences = await db.audience.findAll({
      include: {
        model: db.assigned_audience,
      },
    });
    const groups = await db.group.findAll();
    const teachers = await db.teacher.findAll({
      include: {
        model: db.assigned_teacher,
      },
    });

    let populations = Init(
      classes,
      population_size,
      max_day,
      max_pair,
      audiences
    );

    populations.sort(function (individ1, individ2) {
      individ1.fitnessValue = fitness(individ1, groups, classes, teachers);
      individ2.fitnessValue = fitness(individ2, groups, classes, teachers);
      if (individ1.fitnessValue > individ2.fitnessValue) return 1;
      else if (individ1.fitnessValue == individ2.fitnessValue) return 0;
      else return -1;
    });
    console.log("Hello");
  },
};