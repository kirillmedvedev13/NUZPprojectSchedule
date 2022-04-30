import db from "../database.js";
import MessageType from "../Schema/TypeDefs/MessageType.js";
import Crossing from "./Crossing.js";
import fitness from "./Fitness.js";
import Init from "./Init.js";
import MaxFitnessValue from "./MaxFitnessValue.js";
import Mutation from "./Mutation.js";
import TournamentSelect from "./TournamentSelect.js";

export const RUN_EA = {
  type: MessageType,
  async resolve(parent, { data, id_cathedra }) {
    const info = await db.info.findAll();
    const max_day = info[0].dataValues.max_day;
    const max_pair = info[0].dataValues.max_pair;
    const population_size = 500;
    const max_generations = 500;
    const p_crossover = 0.9;
    const p_mutation = 0.1;
    const p_genes = 0;
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
    // Стркуктура для каждой группы массив закрепленных для неё занятий
    let mapGroupAndAG = new Map();
    for (const group of groups) {
      let temp = [];
      for (const cl of classes) {
        cl.assigned_groups.map((ag) => {
          if (ag.id_group === group.id) temp.push(ag.id);
        });
      }
      mapGroupAndAG.set(group.id, temp);
    }
    // Стркуктура для каждого учителя массив закрепленных для него занятий
    let mapTeacherAndAG = new Map();
    for (const teacher of teachers) {
      let temp = [];
      teacher.assigned_teachers.map((at) => {
        let detected_classes = [];
        detected_classes = classes.filter((cl) => cl.id === at.id_class);
        detected_classes.map((dt) => {
          dt.assigned_groups.map((ag) => {
            temp.push(ag.id);
          });
        });
      });
      mapTeacherAndAG.set(teacher.id, temp);
    }

    let populations = Init(
      classes,
      population_size,
      max_day,
      max_pair,
      audiences,
      mapGroupAndAG,
      mapTeacherAndAG
    );

    /**/
    populations.forEach((individ) => {
      individ.fitnessValue = fitness(individ, mapGroupAndAG, mapTeacherAndAG);
    });

    let generationCount = 0;
    let maxFitnessValue = MaxFitnessValue(populations);
    while (maxFitnessValue > 0 || generationCount < max_generations) {
      generationCount++;
      populations = TournamentSelect(populations, population_size);
      for (let i = 0; i < populations.length; i += 2) {
        if (Math.random() < p_crossover) {
          let parents = Crossing(populations[i], populations[i + 1]);
          populations[i] = parents[0];
          populations[i + 1] = parents[1];
        }
      }
      populations.forEach((mutant) => {
        if (Math.random() < p_mutation) {
          p_genes = 1 / mutant.length;
          mutant = Mutation(mutant, p_genes);
        }
      });
      populations.forEach((individ) => {
        individ.fitnessValue = fitness(individ, mapGroupAndAG, mapTeacherAndAG);
      });
      maxFitnessValue = MaxFitnessValue(populations);
    }
  },
};
