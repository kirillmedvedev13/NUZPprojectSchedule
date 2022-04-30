import GetRndInteger from "./GetRndInteger.js"

export default function Crossing(schedule1, schedule2, classes) {
  let s = GetRndInteger(0, classes.length - 1);
  for (let i = s; i < classes.length; i++) {
      let ids_ag = classes[i].assigned_groups.map(ag => {
        return ag.id;
      })
      let temp1 = [];
      schedule1 = schedule1.filter(sc1 => {
        if(ids_ag.find(id => sc1.id_assigned_group === id)){
          temp1.push(sc1);
          return false;
        }
        else
          return true;
      })
      let temp2 = [];
      schedule2 = schedule2.filter(sc2 => {
        if(ids_ag.find(id => sc2.id_assigned_group === id)){
          temp2.push(sc2);
          return false;
        }
        else
          return true;
      })
      schedule1.push(temp2);
      schedule2.push(temp1);
  }
}
