export default function GetMapTeacherAndAG(teachers, classes) {
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
  return mapTeacherAndAG;
}
