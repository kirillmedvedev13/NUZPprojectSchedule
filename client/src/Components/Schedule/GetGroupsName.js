export default function GetGroupsName(groups) {
  let str = groups[0].group.specialty.cathedra.short_name + " - ";
  for (let group of groups) {
    str += group.group.name + " ";
  }
  return str;
}
