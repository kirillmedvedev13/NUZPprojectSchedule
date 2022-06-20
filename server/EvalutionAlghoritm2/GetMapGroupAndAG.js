export default function GetMapGroupAndAG(groups, classes) {
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
  return mapGroupAndAG;
}
