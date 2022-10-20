import db from "../database.js";
import MessageType from "../Schema/TypeDefs/MessageType.js";
import Init from "./Init.js";
import MinFitnessValue from "./MinFitnessValue.js";
import MeanFitnessValue from "./MeanFitnessValue.js";
import GetRndInteger from "./GetRndInteger.js";
import { cpus } from "node:os";
import workerpool from "workerpool";
import cloneDeep from "clone-deep";
import replacer from "./JSONReplacer.js";
import reviver from "./JSONReviver.js";
import { GraphQLInt } from "graphql";
import { Op } from "sequelize";
import ParseScheduleFromDB from "./ParseScheduleFromDB.js"
import e from "cors";

export const RUN_EA = {
  type: MessageType,
  args: {
    id_cathedra: { type: GraphQLInt },
  },
  async resolve(parent, { id_cathedra }) {
    const info = await db.info.findOne();
    const max_day = info.dataValues.max_day;
    const max_pair = info.dataValues.max_pair;
    const population_size = info.dataValues.population_size;
    const max_generations = info.dataValues.max_generations;
    const p_crossover = info.dataValues.p_crossover;
    const p_mutation = info.dataValues.p_mutation;
    const p_genes = info.dataValues.p_genes;
    const penaltyGrWin = info.dataValues.penaltyGrWin;
    const penaltyTeachWin = info.dataValues.penaltyTeachWin;
    const penaltyLateSc = info.dataValues.penaltyLateSc;
    const penaltyEqSc = info.dataValues.penaltyEqSc;
    const penaltySameTimesSc = info.dataValues.penaltySameTimesSc;
    const p_elitism = info.dataValues.p_elitism;
    const penaltySameRecSc = info.dataValues.penaltySameRecSc;
    let FilterCathedra = {};
    if (id_cathedra) {
      FilterCathedra = {
        id_cathedra: {
          [Op.eq]: id_cathedra,
        }
      }
    }
    let classes = await db.class.findAll({
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
            where: FilterCathedra,
          }
        },
      ],
    });
    let recommended_schedules = await db.recommended_schedule.findAll();
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
    let base_schedule = null;
    if (id_cathedra) {
      let scheduleForGroups = new Map();
      let scheduleForTeachers = new Map();
      let scheduleForAudiences = new Map();
      base_schedule = { scheduleForGroups, scheduleForTeachers, scheduleForAudiences };
      await ParseScheduleFromDB(base_schedule);
    }
    recommended_schedules = recommended_schedules.map((rs) => rs.toJSON());
    teachers = teachers.map((t) => t.toJSON());
    groups = groups.map((g) => g.toJSON());
    audiences = audiences.map((a) => a.toJSON());
    classes = classes.map((c) => c.toJSON());

    let type_select = "tournament";

    // Создание пула потоков
    const numCPUs = cpus().length;
    const pool = workerpool.pool("./EvalutionAlghoritm3/Worker.js", {
      workerType: "auto",
      maxWorkers: numCPUs,
    });

    // Инициализация
    let populations = Init(
      classes,
      population_size,
      max_day,
      max_pair,
      audiences,
      base_schedule
    );
    let bestPopulation = {
      scheduleForGroups: null,
      fitnessValue: Number.MAX_VALUE,
    };
    const num_elit = Math.floor(population_size * p_elitism);

    for (const generationCount of Array(max_generations)
      .fill()
      .map((v, i) => i + 1)) {

      console.time("Fitness");
      // Установка фитнесс значения
      let arr_promisses = [];
      populations.map((individ) => {
        arr_promisses.push(
          pool.exec("workFitness", [
            JSON.stringify(individ, replacer),
            recommended_schedules,
            max_day,
            penaltySameRecSc,
            penaltyGrWin,
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

      bestPopulation = MinFitnessValue(populations, bestPopulation);
      if (bestPopulation.fitnessValue == 0) break;
      console.log(
        generationCount +
        " " +
        bestPopulation.fitnessValue +
        " Mean " +
        MeanFitnessValue(populations)
      );

      // Элитизм
      populations.sort((p1, p2) => {
        if (p1.fitnessValue > p2.fitnessValue) return 1;
        if (p1.fitnessValue < p2.fitnessValue) return -1;
        return 0;
      });
      let elit = new Array(num_elit);
      for (let j = 0; j < num_elit; j++) {
        elit[j] = cloneDeep(populations[j]);
      }

      console.time("Cross")
      // Скрещивание
      populations = [];
      arr_promisses = [];
      for (let i = 0; i < (population_size - num_elit) / 2; i++) {
        let r1 = GetRndInteger(0, num_elit - 1);
        let r2 = GetRndInteger(0, num_elit - 1);
        while (r1 === r2) {
          r1 = GetRndInteger(0, num_elit - 1);
          r2 = GetRndInteger(0, num_elit - 1);
        }
        arr_promisses.push(
          pool.exec("workCrossing", [
            JSON.stringify(elit[r1], replacer),
            JSON.stringify(elit[r2], replacer),
            classes,
          ])
        );
      }
      await Promise.all(arr_promisses).then((res) => {
        res.map((r) => {
          populations.push(JSON.parse(r.population_child1, reviver));
          populations.push(JSON.parse(r.population_child2, reviver));
        });
      });
      console.timeEnd("Cross");

      console.time("Muta");
      // Мутации
      arr_promisses = [];
      populations.map((mutant, index) => {
        if (Math.random() < p_mutation) {
          arr_promisses.push(
            pool.exec("workMutation", [
              JSON.stringify(mutant, replacer),
              p_genes,
              max_day,
              max_pair,
              audiences,
              classes,
            ])
          );
          populations.splice(index, 1);
        }
      });
      await Promise.all(arr_promisses).then((res) => {
        res.map((sch) => {
          populations.push(JSON.parse(sch, reviver));
        });
      });
      console.timeEnd("Muta");

      populations.push(...elit);
      // console.time("Select");
      // Отбор
      // let new_populations = [];
      // arr_promisses = [];
      // switch (type_select) {
      //   case "ranging":
      //     const N = populations.length;
      //     let p_populations = Array(N);
      //     let p_cur = 0;
      //     for (let i = 0; i < N; i++) {
      //       const a = Math.random() + 1;
      //       const b = 2 - a;
      //       p_populations[i] = p_cur;
      //       p_cur = p_cur + (1 / N) * (a - (a - b) * (i / (N - 1)));
      //     }
      //     p_populations.push(1.001);
      //     for (let i = 0; i < population_size - num_elit; i++) {
      //       arr_promisses.push(pool.exec("workSelectRanging", [p_populations]));
      //     }
      //     await Promise.all(arr_promisses).then((res) => {
      //       res.map((index) => {
      //         new_populations.push(cloneDeep(populations[index]));
      //       });
      //     });
      //     break;
      //   case "tournament":
      //     for (let i = 0; i < population_size - num_elit; i++) {
      //       let i1 = 0;
      //       let i2 = i1;
      //       let i3 = i1;
      //       while (i1 == i2 || i2 == i3 || i1 == i3) {
      //         i1 = GetRndInteger(0, populations.length - 1);
      //         i2 = GetRndInteger(0, populations.length - 1);
      //         i3 = GetRndInteger(0, populations.length - 1);
      //       }
      //       const population1 = {
      //         fitnessValue: populations[i1].fitnessValue,
      //         index: i1,
      //       };
      //       const population2 = {
      //         fitnessValue: populations[i2].fitnessValue,
      //         index: i2,
      //       };
      //       const population3 = {
      //         fitnessValue: populations[i3].fitnessValue,
      //         index: i3,
      //       };
      //       arr_promisses.push(
      //         pool.exec("workSelectTournament", [
      //           population1,
      //           population2,
      //           population3,
      //         ])
      //       );
      //     }
      //     await Promise.all(arr_promisses).then((res) => {
      //       res.map((index) => {
      //         new_populations.push(populations[index]);
      //       });
      //     });
      //     break;
      // }
      // populations = new_populations;
      // populations.push(...elit);
      // console.timeEnd("Select");
      // Лучшая популяция

    }
    // Очистка расписания
    await db.schedule.destroy({ truncate: true });
    //Вставка в бд
    let arr = [];
    for (let value of bestPopulation.scheduleForGroups.values()) {
      arr.push(
        ...value.map((schedule) => {
          return {
            number_pair: schedule.number_pair,
            day_week: schedule.day_week,
            pair_type: schedule.pair_type,
            id_assigned_group: schedule.id_assigned_group,
            id_audience: schedule.id_audience,
          };
        })
      );
    }
    let isBulk = await db.schedule.bulkCreate(arr);
    if (isBulk)
      return {
        successful: true,
        message: `Total Fitness: ${bestPopulation.fitnessValue}`,
      };
    else return { successful: false, message: `Some error` };
  },
};
