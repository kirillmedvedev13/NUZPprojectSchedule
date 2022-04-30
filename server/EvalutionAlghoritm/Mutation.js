import CheckPutClassForTeacher from "./CheckPutClassForTeacher";
import CheckPutClassLectureForGroup from "./CheckPutClassLectureForGroup";
import  CheckPutClassPracticeForGroup from "./CheckPutClassPracticeForGroup";
import GetPairTypeForClass from "./GetPairTypeForClass";
import GetRndInteger from "./GetRndInteger";

export default function Mutation(
  individ,
  p_genes,
  max_day,
  max_pair,
  mapGroupAndAG,
  mapTeacherAndAG
) {
  individ.forEach((gene) => {
    if (Math.random() < p_genes) {
      let day_week = GetRndInteger(0, max_day);
      let number_pair = GetRndInteger(0, max_pair);
      let pair_type = GetPairTypeForClass(clas);
      let checkTeach = CheckPutClassForTeacher(
        clas,
        gene,
        day_week,
        number_pair,
        pair_type,
        mapTeacherAndAG
      );
      let checkGroup = class.id_type_class == 1? CheckPutClassLectureForGroup(clas, schedule, day_week, number_pair, pair_type, mapGroupAndAG) : CheckPutClassPracticeForGroup(clas, schedule, day_week, number_pair, pair_type, mapGroupAndAG);
    }
  });
  return individ;
}
