import CheckPutClassForTeacher from "./CheckPutClassForTeacher";
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
      let day = GetRndInteger(0, max_day);
      let pair = GetRndInteger(0, max_pair);
      let checkTeach = CheckPutClassForTeacher();
      let checkGroup;
    }
  });
  return individ;
}
