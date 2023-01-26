import Fitness from "../Service/Fitness.js";
import GetDataFromDB from "../Service/GetDataFromDB.js";
import ParseScheduleFromDB from "../Service/ParseScheduleFromDB.js";
import Init from "./Init.js";
import cloneDeep from "lodash.clonedeep";
import Mutation from "./Mutation.js";
import GetRndInteger from "../Service/GetRndInteger.js";
import db from "../../database.js";

function chooseSchedule(schedule) {
  let chooseSchedule = false;
  let mutation_sched = null;
  while (!chooseSchedule) {
    // Случайное занятие у учителя группы или аудитории
    let r = GetRndInteger(1, 3);
    let sc =
      r === 1
        ? schedule.scheduleForGroups
        : r === 2
        ? schedule.scheduleForTeachers
        : schedule.scheduleForAudiences;
    sc = Array.from(sc.values());
    // Выбор случайной сущности
    if (sc.length) {
      r = GetRndInteger(0, sc.length - 1);
      sc = sc[r];
      // Проверка есть ли занятия для сущности, если да то выбрать его для мутации
      if (sc.length) {
        r = GetRndInteger(0, sc.length - 1);
        chooseSchedule = true;
        mutation_sched = cloneDeep(sc[r]);
      }
    }
  }
  return mutation_sched;
}
function tabuListContains(ntabuList, tabuList) {
  for (let [classId, sched1] of ntabuList) {
    let sched2 = tabuList.get(+classId);
    if (sched2)
      for (let sch of sched1) {
        if (sched2.includes(sch)) {
          console.log(true);
          return true;
        }
      }
  }
  return false;
}
function tabuListRemoveFirst(tabuList, tabu_list_len) {
  for (let [key, arr] of tabuList) {
    if (arr.length > tabu_list_len) arr.shift();
  }
}
function setTabuList(ntabuList, tabuList) {
  for (let [classId, sched1] of ntabuList) {
    let sched2 = tabuList.get(+classId);
    sched2.push(sched1);
  }
}

function chooseCandidate(sNeighborhood, tabuList) {
  let bestCandidate = sNeighborhood[0];
  for (let i = 0; i < sNeighborhood.length; i++) {
    if (
      bestCandidate.nfitness.fitnessValue >
        sNeighborhood[i].nfitness.fitnessValue &&
      !tabuListContains(sNeighborhood[i].ntabuList, tabuList)
    )
      bestCandidate = sNeighborhood[i];
  }
  return bestCandidate;
}

export const RUN_TS = async (id_cathedra, name_algorithm) => {
  let {
    max_day,
    max_pair,
    classes,
    recommended_schedules,
    audiences,
    general_values,
    params,
  } = await GetDataFromDB(id_cathedra, name_algorithm);
  let tabu_tenure, s_neighbors, n_iteration, tabu_list_len, p_class;
  params.forEach((obj) => {
    if (obj.name === "tabu_tenure") tabu_tenure = +obj.value;
    else if (obj.name === "s_neighbors") s_neighbors = +obj.value;
    else if (obj.name === "n_iteration") n_iteration = +obj.value;
    else if (obj.name === "p_class") p_class = +obj.value;
    else tabu_list_len = +obj.value;
  });

  let results = [];
  // Получения расписания для груп учителей если они есть  в других кафедрах
  let db_schedule = await ParseScheduleFromDB(id_cathedra);
  let { schedule, tabuList } = Init(
    classes,
    max_day,
    max_pair,
    audiences,
    db_schedule
  );
  let bestSchedule = schedule;
  let i = 0;
  let bestFitness = Fitness(
    bestSchedule,
    recommended_schedules,
    max_day,
    general_values
  );
  let start_time = new Date().getTime();
  while (bestFitness > 0 || i < n_iteration) {
    let sNeighborhood = [];
    for (let j = 0; j < s_neighbors; j++) {
      let neighbor = cloneDeep(bestSchedule);
      let ntabuList = new Map();
      let mutation_sched = chooseSchedule(neighbor);
      Mutation(
        neighbor,
        max_day,
        max_pair,
        audiences,
        mutation_sched,
        ntabuList
      );
      let nfitness = Fitness(
        neighbor,
        recommended_schedules,
        max_day,
        general_values
      );
      sNeighborhood.push({ neighbor, ntabuList, nfitness });
    }
    let bestCandidate = chooseCandidate(sNeighborhood, tabuList);
    if (bestFitness.fitnessValue > bestCandidate.nfitness.fitnessValue) {
      bestSchedule = bestCandidate.neighbor;
      bestFitness = bestCandidate.nfitness;
      setTabuList(bestCandidate.ntabuList, tabuList);
    }
    tabuListRemoveFirst(tabuList, tabu_list_len);
    console.log(`iteration: ${i} | fitness: ${bestFitness.fitnessValue}`);
    results.push([new Date().getTime() - start_time, bestFitness.fitnessValue]);
    i++;
  }
  results = JSON.stringify(results);
  await db.algorithm.update({ results }, { where: { name: name_algorithm } });
  let arrClass = new Set();
  let arrGroup = Array.from(bestSchedule.scheduleForGroups.values());
  for (const sc_group of arrGroup) {
    for (const sc of sc_group) {
      arrClass.add(
        JSON.stringify({
          day_week: sc.day_week,
          number_pair: sc.number_pair,
          pair_type: sc.pair_type,
          id_class: sc.clas.id,
          id_audience: sc.id_audience,
        })
      );
    }
  }
  let arr = [];
  arrClass.forEach((sched) => arr.push(JSON.parse(sched)));
  let isBulk = await db.schedule.bulkCreate(arr);
  if (isBulk)
    return {
      successful: true,
      message: `Success`,
    };
  else return { successful: false, message: `Some error` };
};
