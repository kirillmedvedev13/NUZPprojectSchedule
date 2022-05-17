import GetRndInteger from "./GetRndInteger.js";
import { parentPort, workerData } from "worker_threads";

parentPort.on("message", (param) => {
  const res = Crossing(param);
  parentPort.postMessage(res);
});

function Crossing(param) {
  const { classes } = workerData;
  const { schedule1, schedule2 } = param;
  let s = GetRndInteger(0, classes.length / 2);
  let current_schedule1 = schedule1.slice(0);
  let current_schedule2 = schedule2.slice(0);
  for (let i = s; i < 2 * s; i++) {
    let type_class = classes[i].id_type_class;
    // Если лекция, то меняется для всех групп
    if (type_class === 1) {
      // Закре группы для текущего занятия
      let ids_ag = classes[i].assigned_groups.map((ag) => {
        return ag.id;
      });
      let { new_schedule1, new_schedule2, temp1, temp2 } = changeSchedule(
        ids_ag,
        current_schedule1,
        current_schedule2
      );
      current_schedule1 = new_schedule1;
      current_schedule2 = new_schedule2;
      current_schedule1.push(...temp2);
      current_schedule2.push(...temp1);
    }
    //Если практика, то для каждой группы отдельно
    else if (type_class === 2) {
      classes[i].assigned_groups.forEach((ag) => {
        let ids_ag = [ag.id];
        let { new_schedule1, new_schedule2, temp1, temp2 } = changeSchedule(
          ids_ag,
          current_schedule1,
          current_schedule2
        );
        current_schedule1 = new_schedule1;
        current_schedule2 = new_schedule2;
        current_schedule1.push(...temp2);
        current_schedule2.push(...temp1);
      });
    }
  }
  const population_child1 = {
    schedule: current_schedule1,
    fitnessValue: null,
  };
  const population_child2 = {
    schedule: current_schedule2,
    fitnessValue: null,
  };
  return { population_child1, population_child2 };
}

function changeSchedule(ids_ag, schedule1, schedule2) {
  let temp1 = [];
  let temp2 = [];
  //  расписание 1 без предметов из ids_ag
  schedule1 = schedule1.filter((sc1) => {
    if (ids_ag.find((id) => sc1.id_assigned_group === id)) {
      temp1.push(sc1);
      return false;
    } else return true;
  });
  //  расписание 2 без предметов из ids_ag
  schedule2 = schedule2.filter((sc2) => {
    if (ids_ag.find((id) => sc2.id_assigned_group === id)) {
      temp2.push(sc2);
      return false;
    } else return true;
  });
  return { new_schedule1: schedule1, new_schedule2: schedule2, temp1, temp2 };
}
