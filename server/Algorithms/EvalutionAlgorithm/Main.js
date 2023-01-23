import db from "../../database.js";
import Init from "./Init.js";
import MinFitnessValue from "./MinFitnessValue.js";
import MeanFitnessValue from "./MeanFitnessValue.js";
import { cpus } from "node:os";
import workerpool from "workerpool";
import cloneDeep from "clone-deep";
import replacer from "./JSONReplacer.js";
import reviver from "./JSONReviver.js";
import GetDataFromDB from "../Service/GetDataFromDB.js";
import GetRndInteger from "../Service/GetRndInteger.js";
import GetBaseSchedule from "./GetBaseSchedule.js";

export const RUN_EA = async (id_cathedra, name_algorithm) => {
  let {
    max_day,
    max_pair,
    classes,
    recommended_schedules,
    audiences,
    groups,
    teachers,
    params,
    general_values,
  } = await GetDataFromDB(id_cathedra, name_algorithm);
  let {
    population_size,
    max_generations,
    p_crossover,
    p_mutation,
    p_genes,
    p_elitism,
  } = params;
  let base_schedule = null;
  GetBaseSchedule(base_schedule, id_cathedra);

  let type_select = "tournament";

  // Создание пула потоков
  const numCPUs = cpus().length;
  const pool = workerpool.pool("./Algorithms/EvalutionAlgorithm/Worker.js", {
    workerType: "auto",
    maxWorkers: numCPUs,
  });

  let results = [];
  let start_time = new Date().getTime();
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
    console.time("Cross");
    // Скрещивание
    let arr_promisses = [];
    for (let i = 0; i < population_size / 2; i++) {
      if (Math.random() < p_crossover) {
        let r1 = GetRndInteger(0, populations.length - 1);
        let r2 = GetRndInteger(0, populations.length - 1);
        while (r1 === r2) {
          r1 = GetRndInteger(0, populations.length - 1);
          r2 = GetRndInteger(0, populations.length - 1);
        }
        arr_promisses.push(
          pool.exec("workCrossing", [
            JSON.stringify(populations[r1], replacer),
            JSON.stringify(populations[r2], replacer),
            classes,
          ])
        );
        if (r1 > r2) {
          populations.splice(r1, 1);
          populations.splice(r2, 1);
        } else {
          populations.splice(r2, 1);
          populations.splice(r1, 1);
        }
      }
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
    console.time("Fitness");
    // Установка фитнесс значения
    arr_promisses = [];
    populations.map((individ) => {
      arr_promisses.push(
        pool.exec("workFitness", [
          JSON.stringify(individ, replacer),
          recommended_schedules,
          max_day,
          general_values,
          true,
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
    let elit = new Array(num_elit);
    for (let j = 0; j < num_elit; j++) {
      elit[j] = cloneDeep(populations[j]);
    }
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
            new_populations.push(cloneDeep(populations[index]));
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
            fitnessValue: populations[i2].fitnessValue,
            index: i2,
          };
          const population3 = {
            fitnessValue: populations[i3].fitnessValue,
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
            new_populations.push(populations[index]);
          });
        });
        break;
    }
    populations = new_populations;
    populations.push(...elit);
    console.timeEnd("Select");
    // Лучшая популяция
    bestPopulation = MinFitnessValue(populations, bestPopulation);
    results.push([
      new Date().getTime() - start_time,
      bestPopulation.fitnessValue,
    ]);
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
  results = JSON.stringify(results);
  await db.algorithm.update(
    { results },
    { where: { name: name_algorithm } }
  );

  let arrClass = new Set();
  for (let value of bestPopulation.scheduleForGroups.values()) {
    value.forEach((schedule) => {
      arrClass.add(
        JSON.stringify({
          number_pair: schedule.number_pair,
          day_week: schedule.day_week,
          pair_type: schedule.pair_type,
          id_class: schedule.id_class,
          id_audience: schedule.id_audience,
        })
      );
    });
  }
  let arr = [];
  arrClass.forEach((sched) => arr.push(JSON.parse(sched)));
  let isBulk = await db.schedule.bulkCreate(arr);
  if (isBulk)
    return {
      successful: true,
      message: `Total Fitness: ${bestPopulation.fitnessValue}`,
    };
  else return { successful: false, message: `Some error` };
};
