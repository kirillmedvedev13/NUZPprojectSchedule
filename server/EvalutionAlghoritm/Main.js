import db from "../database.js";
import MessageType from "../Schema/TypeDefs/MessageType.js";
import Init from "./Init.js";
import MinFitnessValue from "./MinFitnessValue.js";
import MeanFitnessValue from "./MeanFitnessValue.js";
import GetRndInteger from "./GetRndInteger.js";
import { cpus } from "node:os";
import GetMapTeacherAndAG from "./GetMapTeacherAndAG.js";
import GetMapGroupAndAG from "./GetMapGroupAndAG.js";
import workerpool from "workerpool";

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


    teachers = teachers.map((t) => t.toJSON());
    groups = groups.map((g) => g.toJSON());
    audiences = audiences.map((a) => a.toJSON());
    classes = classes.map((c) => c.toJSON());
    let type_select = "ranging";

    // Структура для каждой группы массив закрепленных для неё занятий
    let mapGroupAndAG = GetMapGroupAndAG(groups, classes);
    // Структура для каждого учителя массив закрепленных для него занятий
    let mapTeacherAndAG = GetMapTeacherAndAG(teachers, classes);

    // Создание пула потоков
    const numCPUs = cpus().length;
    const pool = workerpool.pool("./EvalutionAlghoritm/Worker.js", {
      workerType: "thread",
      maxWorkers: numCPUs,
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
    const num_elit = Math.floor(population_size * p_elitism);

    for (const generationCount of Array(max_generations)
      .fill()
      .map((v, i) => i + 1)) {
      console.time("Cross");
      // Скрещивание
      let arr_promisses = [];
      for (let i = 0; i < population_size / 2; i++) {
        if (Math.random() < p_crossover) {
          arr_promisses.push(
            pool.exec("workCrossing", [
              populations[GetRndInteger(0, populations.length - 1)].schedule,
              populations[GetRndInteger(0, populations.length - 1)].schedule,
              classes,
            ])
          );
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
          arr_promisses.push(pool.exec('workMutation', [mutant.schedule, (populations.length * p_genes) / populations.length, max_day, max_pair, audiences, mapGroupAndAG, mapTeacherAndAG]));
        }
      });
      await Promise.all(arr_promisses).then((res) => {
        res.map((sch) => {
          populations.push({ schedule: sch, fitnessValue: null });
        });
      });
      console.timeEnd("Muta");
      console.time("Fitness");
      // Установка фитнесс значения
      arr_promisses = [];
      populations.map((individ) => {
        arr_promisses.push(
          pool.exec("workFitness", [
            individ.schedule,
            mapTeacherAndAG,
            mapGroupAndAG,
            penaltyGrWin,
            penaltyLateSc,
            penaltyEqSc,
            penaltySameTimesSc,
            penaltyTeachWin,
          ])
        );
      });
      await Promise.all(arr_promisses).then((res) => {
        res.map((value, index) => {
          populations[index].fitnessValue = value.fitnessValue;
        });
      });
      console.timeEnd("Fitness");
      console.time("Select");
      // Элитизм
      populations.sort((p1, p2) => {
        if (p1.fitnessValue > p2.fitnessValue) return 1;
        if (p1.fitnessValue < p2.fitnessValue) return -1;
        return 0;
      });
      let elit = populations.slice(0, num_elit);
      elit = elit.map((p) => JSON.parse(JSON.stringify(p)));
      // Отбор
      let new_populations = [];
      arr_promisses = [];
      switch (type_select) {
        case "ranging":
          const N = populations.length;
          let p_populations = Array(N);
          let p_cur = 0;
          for (let i = 0; i < N; i++) {
            const a = Math.random() + 1;
            const b = 2 - a;
            p_populations[i] = p_cur;
            p_cur = p_cur + (1 / N) * (a - (a - b) * (i / (N - 1)));
          }
          p_populations.push(1.001);
          for (let i = 0; i < population_size - num_elit; i++) {
            arr_promisses.push(pool.exec("workSelectRanging", [p_populations]));
          }
          await Promise.all(arr_promisses).then((res) => {
            res.map((index) => {
              new_populations.push({
                schedule: populations[index].schedule.slice(0),
                fitnessValue: populations[index].fitnessValue,
              });
            });
          });
          break;
        case "tournament":
          for (let i = 0; i < population_size - num_elit; i++) {
            let i1 = 0;
            let i2 = i1;
            let i3 = i1;
            while (i1 == i2 || i2 == i3 || i1 == i3) {
              i1 = GetRndInteger(0, populations.length - 1);
              i2 = GetRndInteger(0, populations.length - 1);
              i3 = GetRndInteger(0, populations.length - 1);
            }
            const population1 = {
              fitnessValue: populations[i1].fitnessValue,
              index: i1,
            };
            const population2 = {
              fitnessValue: populations[i1].fitnessValue,
              index: i2,
            };
            const population3 = {
              fitnessValue: populations[i1].fitnessValue,
              index: i3,
            };
            arr_promisses.push(
              pool.exec("workSelectTournament", [
                population1,
                population2,
                population3,
              ])
            );
          }
          await Promise.all(arr_promisses).then((res) => {
            res.map((index) => {
              new_populations.push({
                schedule: populations[index].schedule.slice(0),
                fitnessValue: populations[index].fitnessValue,
              });
            });
          });
          break;
      }
      populations = new_populations;
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
    // Очистка расписания
    await db.schedule.destroy({ truncate: true });
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
