import db from "../database.js";
import MessageType from "../Schema/TypeDefs/MessageType.js";
import Init from "./Init.js";
import MinFitnessValue from "./MinFitnessValue.js";
import MeanFitnessValue from "./MeanFitnessValue.js";
import GetRndInteger from "./GetRndInteger.js";
import { cpus } from "node:os";
import { StaticPool } from "node-worker-threads-pool";
import cloneDeep from "lodash/clonedeep.js";
import GetMapTeacherAndAG from "./GetMapTeacherAndAG.js";
import GetMapGroupAndAG from "./GetMapGroupAndAG.js";
import SelectRanging from "./SelectRanging.js";

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
    const p_elitism = info[0].dataValues.p_elitism;
    let classes = await db.class.findAll({
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
    let audiences = await db.audience.findAll({
      include: {
        model: db.assigned_audience,
      },
    });
    let groups = await db.group.findAll();
    let teachers = await db.teacher.findAll({
      include: {
        model: db.assigned_teacher,
      },
    });

    // Очистка расписания
    await db.schedule.destroy({ truncate: true });

    teachers = teachers.map(t => t.toJSON());
    groups = groups.map(g => g.toJSON());
    audiences = audiences.map(a => a.toJSON());
    classes = classes.map(c => c.toJSON());


    // Структура для каждой группы массив закрепленных для неё занятий
    let mapGroupAndAG = GetMapGroupAndAG(groups, classes);
    // Структура для каждого учителя массив закрепленных для него занятий
    let mapTeacherAndAG = GetMapTeacherAndAG(teachers, classes);

    // Создание пула потоков
    const numCPUs = cpus().length;
    const staticPoolCrossing = new StaticPool({
      size: numCPUs,
      task: "./EvalutionAlghoritm/Crossing.js",
      workerData: {
        classes,
      }
    });
    const staticPoolMutation = new StaticPool({
      size: numCPUs,
      task: "./EvalutionAlghoritm/Mutation.js",
      workerData: {
        p_genes,
        max_day,
        max_pair,
        audiences,
      },
    });
    const staticPoolSelect = new StaticPool({
      size: numCPUs,
      task: "./EvalutionAlghoritm/SelectTournament.js",
    });
    const staticPoolFitness = new StaticPool({
      size: numCPUs,
      task: "./EvalutionAlghoritm/Fitness.js",
      workerData: {
        mapGroupAndAG,
        mapTeacherAndAG,
        penaltyGrWin,
        penaltyTeachWin,
        penaltyLateSc,
        penaltyEqSc,
        penaltySameTimesSc,
      },
    });

    // Инициализация
    let populations = Init(
      classes,
      population_size,
      max_day,
      max_pair,
      audiences
    );
    let bestPopulation = { schedule: null, fitnessValue: Number.MAX_VALUE };
    const type_select = "tournament";
    const num_elit = Math.floor(population_size * p_elitism);
    for (const generationCount of Array(max_generations)
      .fill()
      .map((v, i) => i + 1)) {
      console.time("Cross");
      // Скрещивание
      let arr_promisses = [];
      for (let i = 0; i < population_size / 2; i++) {
        if (Math.random() < p_crossover) {
          const param = JSON.stringify({
            schedule1:
              populations[GetRndInteger(0, populations.length - 1)].schedule,
            schedule2:
              populations[GetRndInteger(0, populations.length - 1)].schedule,
          });
          arr_promisses.push(staticPoolCrossing.exec(param));
        }
      }
      await Promise.all(arr_promisses).then((res) => {
        res.map((r) => {
          populations.push(r.population_child1);
          populations.push(r.population_child2);
        });
      });
      console.timeEnd("Cross");
      console.time("Muta");
      // Мутации
      arr_promisses = [];
      populations.map((mutant, index) => {
        if (Math.random() < p_mutation) {
          const param = JSON.stringify({
            schedule: mutant.schedule,
          });
          arr_promisses.push(staticPoolMutation.exec(param));
        }
      });
      await Promise.all(arr_promisses).then((res) => {
        res.map((r) => {
          populations.push({ schedule: r, fitnessValue: null });
        });
      });
      console.timeEnd("Muta");
      console.time("Fitness");
      // Установка фитнесс значения
      arr_promisses = [];
      populations.map((individ) => {
        const param = JSON.stringify({ schedule: individ.schedule });
        arr_promisses.push(staticPoolFitness.exec(param));
      });
      await Promise.all(arr_promisses).then((res) => {
        res.map((value, index) => {
          populations[index].fitnessValue = value;
        });
      });
      console.timeEnd("Fitness");
      console.time("Select");
      // Элитизм
      populations.sort((p1, p2) => {
        if (p1.fitnessValue < p2.fitnessValue) return 1;
        if (p1.fitnessValue > p2.fitnessValue) return -1;
        return 0;
      });
      let elit = populations.slice(populations.length - num_elit, populations.length);
      elit = elit.map(p => JSON.parse(JSON.stringify(p)))
      // Отбор
      switch (type_select) {
        case "ranging":
          populations = SelectRanging(populations, population_size - num_elit);
          break;
        case "tournament":
          arr_promisses = [];
          for (let i = 0; i < population_size - num_elit; i++) {
            let i1 = 0;
            let i2 = i1;
            let i3 = i1;
            while (i1 == i2 || i2 == i3 || i1 == i3) {
              i1 = GetRndInteger(0, populations.length - 1);
              i2 = GetRndInteger(0, populations.length - 1);
              i3 = GetRndInteger(0, populations.length - 1);
            }
            const param = JSON.stringify({
              population1: {
                fitnessValue: populations[i1].fitnessValue,
                index: i1,
              },
              population2: {
                fitnessValue: populations[i1].fitnessValue,
                index: i2,
              },
              population3: {
                fitnessValue: populations[i1].fitnessValue,
                index: i3,
              },
            });
            arr_promisses.push(staticPoolSelect.exec(param));
          }
          let new_populations = [];
          await Promise.all(arr_promisses).then((res) => {
            res.map((index) => {
              new_populations.push(Object.assign({}, populations[index]));
            });
          });
          populations = new_populations;
          break;
      }
      populations.push(...elit);
      console.timeEnd("Select");
      // Лучшая популяция
      bestPopulation = MinFitnessValue(populations, bestPopulation);

      if (bestPopulation.fitnessValue == 0) break;

      console.log(
        generationCount +
        " " +
        bestPopulation.fitnessValue +
        " Mean " +
        MeanFitnessValue(populations)
      );
    }

    //Вставка в бд
    let isBulk = await db.schedule.bulkCreate(
      bestPopulation.schedule.map((schedule) => {
        return {
          number_pair: schedule.number_pair,
          day_week: schedule.day_week,
          pair_type: schedule.pair_type,
          id_assigned_group: schedule.id_assigned_group,
          id_audience: schedule.id_audience,
        };
      })
    );
    if (isBulk)
      return {
        successful: true,
        message: `Total Fitness: ${bestPopulation.fitnessValue}`,
      };
    else return { successful: false, message: `Some error` };
  },
};
