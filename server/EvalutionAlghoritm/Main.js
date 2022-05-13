import db from "../database.js";
import MessageType from "../Schema/TypeDefs/MessageType.js";
import fitness from "./Fitness.js";
import Init from "./Init.js";
import Mutation from "./Mutation.js";
import SelectTournament from "./SelectTournament.js";
import MinFitnessValue from "./MinFitnessValue.js";
import MeanFitnessValue from "./MeanFitnessValue.js";
import GetRndInteger from "./GetRndInteger.js";
import { cpus } from "node:os"
import { DynamicPool } from "node-worker-threads-pool"
const numCPUs = cpus.length;

export const RUN_EA = {
  type: MessageType,
  async resolve(parent) {
    const info = await db.info.findAll();
    const max_day = info[0].dataValues.max_day;
    const max_pair = info[0].dataValues.max_pair;
    const population_size = info[0].dataValues.population_size;
    const max_generations = info[0].dataValues.max_generations;
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
    // Структура для каждого учителя массив закрепленных для него занятий
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

    // Создание пула потоков
    const dynamicPool = new DynamicPool(numCPUs);

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
      let arr_promisses = [];
      for (let i = 0; i < population_size / 4; i++) {
        if (Math.random() < p_crossover) {
          arr_promisses.push(dynamicPool.exec({
            task: './Crossing.js',
            param: {
              schedule1: populations[GetRndInteger(0, populations.length - 1)].schedule,
              schedule2: populations[GetRndInteger(0, populations.length - 1)].schedule,
              classes,
            }
          })
          )
        }
      }

      await Promise.all(arr_promisses).then((res) => {
        res.map(r => {
          populations.push(r.population_child1);
          populations.push(r.population_child2);
        })
      })

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
