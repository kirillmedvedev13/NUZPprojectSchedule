import GetRndInteger from "./GetRndInteger.js";

export default function Crossing(schedule1, schedule2, classes) {
  let s = GetRndInteger(0, (classes.length - 1) / 2);
  let f = GetRndInteger(0, (classes.length - 1) / 2);
  for (let i = s; i <= s + f; i++) {
    // Закреп группы для текущего занятия
    let ids_ag = classes[i].assigned_groups.map((ag) => {
      return ag.id;
    });
    let { new_schedule1, new_schedule2, temp1, temp2 } = changeSchedule(
      ids_ag,
      schedule1,
      schedule2
    );
    new_schedule1.push(...temp2);
    new_schedule2.push(...temp1);
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
}

function changeSchedule(ids_ag, schedule1, schedule2) {
  let temp1 = [];
  let temp2 = [];
  //  расписание 1 без предметов из ids_ag
  let new_schedule1 = schedule1.filter((sc1) => {
    if (ids_ag.find((id) => sc1.id_assigned_group === id)) {
      temp1.push(sc1);
      return false;
    } else return true;
  });
  //  расписание 2 без предметов из ids_ag
  let new_schedule2 = schedule2.filter((sc2) => {
    if (ids_ag.find((id) => sc2.id_assigned_group === id)) {
      temp2.push(sc2);
      return false;
    } else return true;
  });
  return { new_schedule1, new_schedule2, temp1, temp2 };
}
