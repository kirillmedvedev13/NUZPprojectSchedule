import db from "../database.js";
import MessageType from "../Schema/TypeDefs/MessageType.js";
import Init from "./Init.js";
import MinFitnessValue from "./MinFitnessValue.js";
import MeanFitnessValue from "./MeanFitnessValue.js";
import GetRndInteger from "./GetRndInteger.js";
import { cpus } from "node:os";
import { StaticPool } from "node-worker-threads-pool";
import cloneDeep from "lodash/clonedeep.js";

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
    await db.schedule.destroy({ truncate: true });

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
    const numCPUs = cpus().length;
    const staticPoolCrossing = new StaticPool({
      size: numCPUs,
      task: "./EvalutionAlghoritm/Crossing.js",
      workerData: JSON.stringify({
        classes
      })
    });
    const staticPoolMutation = new StaticPool({
      size: numCPUs,
      task: "./EvalutionAlghoritm/Mutation.js",
      workerData: JSON.stringify({
        p_genes,
        max_day,
        max_pair,
        audiences
      })
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
    let p_elit = 0.3;
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
              populations[GetRndInteger(0, populations.length - 1)].schedule
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
            schedule: mutant.schedule
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
      populations.map((individ, index) => {
        const param = JSON.stringify({ schedule: individ.schedule, index });
        arr_promisses.push(staticPoolFitness.exec(param));
      });
      await Promise.all(arr_promisses).then((res) => {
        res.map((r) => {
          populations[r.index].fitnessValue = r.value;
        });
      });
      console.timeEnd("Fitness");
      console.time("Select");
      // Элитизм
      populations.sort((p1, p2) => {
        if (p1.fitnessValue > p2.fitnessValue)
          return 1;
        if (p1.fitnessValue < p2.fitnessValue)
          return -1;
        return 0;
      })
      let elit = populations.splice(0, population_size * p_elit);
      // Отбор
      arr_promisses = [];
      for (let i = 0; i < population_size * (1 - p_elit); i++) {
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
      populations.push(...elit)
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
