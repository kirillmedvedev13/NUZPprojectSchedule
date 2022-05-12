import db from "../database.js";
import MessageType from "../Schema/TypeDefs/MessageType.js";
import Crossing from "./Crossing.js";
import fitness from "./Fitness.js";
import Init from "./Init.js";
import Mutation from "./Mutation.js";
import SelectTournament from "./SelectTournament.js";
import MinFitnessValue from "./MinFitnessValue.js";
import MeanFitnessValue from "./MeanFitnessValue.js";
import GetRndInteger from "./GetRndInteger.js";
import SelectRoulette from "./SelectRoulette.js";

export const RUN_EA = {
  type: MessageType,
  async resolve(parent) {
    const info = await db.info.findAll();
    const max_day = info[0].dataValues.max_day;
    const max_pair = info[0].dataValues.max_pair;
    const population_size = 500;
    const max_generations = 1000;
    const p_crossover = 0.1;
    const p_mutation = 0.3;
    const p_genes = 0.01;
    const penaltyGrWin = 1;
    const penaltyTeachWin = 1;
    const penaltyLateSc = 0;
    const penaltyEqSc = 2;
    const penaltySameTimesSc = 10;
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
    // Очистка расписания
    // await db.schedule.destroy({ truncate: true });

    // Структура для каждой группы массив закрепленных для неё занятий
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

    // Инициализация
    let populations = Init(
      classes,
      population_size,
      max_day,
      max_pair,
      audiences
    );

    // Установка целевого значения
    populations.map((individ) => {
      individ.fitnessValue = fitness(
        individ.schedule,
        mapGroupAndAG,
        mapTeacherAndAG,
        penaltyGrWin,
        penaltyTeachWin,
        penaltyLateSc,
        penaltyEqSc,
        penaltySameTimesSc
      );
    });

    let generationCount = 0;
    let bestPopulation = MinFitnessValue(populations, {
      fitnessValue: Number.MAX_VALUE,
    });
    while (bestPopulation.fitnessValue > 0 && generationCount < max_generations) {
      generationCount++;

      // Скрещивание
      let population_child = [];
      for (let i = 0; i < population_size / 4; i++) {
        if (Math.random() < p_crossover) {
          Crossing(
            populations[GetRndInteger(0, populations.length - 1)].schedule,
            populations[GetRndInteger(0, populations.length - 1)].schedule,
            classes,
            population_child
          );
        }
      }

      populations.push(...population_child);
      // Мутации
      populations.map((mutant) => {
        if (Math.random() < p_mutation) {
          mutant.schedule = Mutation(
            mutant.schedule,
            p_genes,
            max_day,
            max_pair,
            audiences,
          );
        }
      });

      // Установка фитнесс значения
      populations.map((individ) => {
        individ.fitnessValue = fitness(
          individ.schedule,
          mapGroupAndAG,
          mapTeacherAndAG,
          penaltyGrWin,
          penaltyTeachWin,
          penaltyLateSc,
          penaltyEqSc,
          penaltySameTimesSc
        );
      });

      // Отбор
      //populations = SelectRoulette(populations);
      populations = SelectTournament(populations, population_size);

      // Лучшая популяция
      bestPopulation = MinFitnessValue(populations, bestPopulation);

      console.log(
        generationCount +
        " " +
        bestPopulation.fitnessValue +
        " Mean " +
        MeanFitnessValue(populations)
      );
    }

    // Вставка в бд
    // let isBulk = await db.schedule.bulkCreate(
    //   bestPopulation.schedule.map((schedule) => {
    //     return {
    //       number_pair: schedule.number_pair,
    //       day_week: schedule.day_week,
    //       pair_type: schedule.pair_type,
    //       id_assigned_group: schedule.id_assigned_group,
    //       id_audience: schedule.id_audience,
    //     };
    //   })
    // );
    // if (isBulk)
    //   return {
    //     successful: true,
    //     message: `Total Fitness: ${bestPopulation.fitnessValue}`,
    //   };
    // else 
    return { successful: false, message: `Some error` };
  },
};
