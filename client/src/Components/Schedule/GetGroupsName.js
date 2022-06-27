export default function GetGroupsName(strGroups) {
  let groups = strGroups.split(",");
  if (groups.length === 1) return groups[0];
  else {
    groups.sort();
    let stringGr = groups[0];
    let curShortName = groups[0].split("-")[0];
    for (let i = 1; i < groups.length; i++) {
      let curGroup = groups[i].split("-");
      if (curShortName === curGroup[0]) stringGr += ", " + curGroup[1];
      else {
        curShortName = curGroup[0];
        stringGr += ", " + groups[i];
      }
    }
    return stringGr;
  }
}
