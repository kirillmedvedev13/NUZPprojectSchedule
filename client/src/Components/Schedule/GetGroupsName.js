export default function GetGroupsName(groups) {
  let str = groups[0].group.specialty.cathedra.short_name + "-";
  for (let i = 0; i < groups.length - 1; i++) {
    str += groups[i].group.name + ", ";
  }
  str += groups[groups.length - 1].group.name;
  return str;
}
