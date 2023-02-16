import Fitness from "../Service/Fitness.js";
import GetDataFromDB from "../Service/GetDataFromDB.js";
import ParseScheduleFromDB from "../Service/GetBaseSchedule.js";
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
  //проверка если расписание находится в списке запретов
  for (let [classId, sched1] of ntabuList) {
    let sched2 = tabuList.get(+classId);
    if (sched2)
      for (let sch of sched1) {
        if (sched2.includes(sch)) {
          console.log("Schedule is in Tabu-list");
          return true;
        }
      }
  }
  return false;
}
function tabuListUpdate(tabuList, tabu_list_len, tabuListTime, tabu_tenure) {
  //обновления списка запретов (если прошел термин действия или достигнут макс длина списка)
  for (let [key, arr] of tabuListTime) {
    let arr2 = tabuList.get(key);
    for (let i = 0; i < arr.length; i++) {
      arr[i] += 1;
      if (arr[i] > tabu_tenure) {
        arr.splice(i, 1);
        arr2.splice(i, 1);
      }
    }
    if (arr.length > tabu_list_len) {
      arr.shift();
      arr2.shift();
    }
  }
}
function setTabuList(ntabuList, tabuList, tabuListTime) {
  for (let [classId, sched1] of ntabuList) {
    let sched2 = tabuList.get(+classId);
    if (!sched2) sched2 = new Array();
    sched2.push(sched1);
    tabuList.set(+classId, sched2);

    sched2 = tabuListTime.get(+classId);
    if (!sched2) sched2 = new Array();
    sched2.push(0);
    tabuListTime.set(+classId, sched2);
  }
}

function chooseCandidate(sNeighborhood, tabuList, aspiration) {
  //выбор кандидата
  let bestCandidate = sNeighborhood[0];
  for (let i = 0; i < sNeighborhood.length; i++) {
    if (!aspiration) {
      //лучший фитнес и не табу
      if (
        bestCandidate.nfitness.fitnessValue >
        sNeighborhood[i].nfitness.fitnessValue &&
        !tabuListContains(sNeighborhood[i].ntabuList, tabuList)
      )
        bestCandidate = sNeighborhood[i];
    } else {
      if (
        bestCandidate.nfitness.fitnessValue >
        sNeighborhood[i].nfitness.fitnessValue
      )
        bestCandidate = sNeighborhood[i];
    }
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

  n_iteration = n_iteration == 0 ? Number.MAX_VALUE : n_iteration;
  let results = [];
  // Получения расписания для груп учителей если они есть  в других кафедрах
  let db_schedule = await ParseScheduleFromDB(id_cathedra);
  let i = 0;
  let { schedule, tabuList } = Init(
    classes,
    max_day,
    max_pair,
    audiences,
    db_schedule
  );
  let bestSchedule = schedule;

  let tabuListTime = new Map();

  for (let [classId, sched1] of tabuList) {
    let temp = [];
    for (let sch of sched1) temp.push(0);
    tabuListTime.set(classId, temp);
  }

  let bestFitness = Fitness(
    bestSchedule,
    recommended_schedules,
    max_day,
    general_values
  );
  let aspiration = false;
  let numberMut = 1;
  let start_time = new Date().getTime();
  let j = 0;
  while (bestFitness > 0 || i < n_iteration) {
    let sNeighborhood = [];
    for (let j = 0; j < s_neighbors; j++) {
      let neighbor = cloneDeep(bestSchedule);
      let ntabuList = new Map();
      for (let k = 0; k < numberMut; k++) {
        let mutation_sched = chooseSchedule(neighbor);
        Mutation(
          neighbor,
          max_day,
          max_pair,
          audiences,
          mutation_sched,
          ntabuList
        );
      }
      let nfitness = Fitness(
        neighbor,
        recommended_schedules,
        max_day,
        general_values
      );
      sNeighborhood.push({ neighbor, ntabuList, nfitness });
    }
    /*if (j >= 300) {
      aspiration = true;
      j = 0;
    }*/
    let bestCandidate = chooseCandidate(sNeighborhood, tabuList, aspiration);
    if (bestFitness.fitnessValue > bestCandidate.nfitness.fitnessValue) {
      bestSchedule = bestCandidate.neighbor;
      bestFitness = bestCandidate.nfitness;
      setTabuList(bestCandidate.ntabuList, tabuList, tabuListTime);
      aspiration = false;
      //j = 0;
    }
    tabuListUpdate(tabuList, tabu_list_len, tabuListTime, tabu_tenure, i);
    console.log(`iteration: ${i} | fitness: ${bestFitness.fitnessValue}`);
    results.push([new Date().getTime() - start_time, bestFitness.fitnessValue]);

    i++;
    //j++;
  }
  results = JSON.stringify(results);
  let params_value = JSON.stringify({
    tabu_tenure,
    s_neighbors,
    n_iteration,
    tabu_list_len,
  });
  let res = await db.results_algorithm.findOne({ where: { params_value } });
  if (res)
    await db.results_algorithm.update({ results }, { where: { params_value } });
  else
    await db.results_algorithm.create({
      params_value,
      name_algorithm,
      results,
    });
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
