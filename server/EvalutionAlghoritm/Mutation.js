import CheckPutClassForTeacher from "./CheckPutClassForTeacher.js";
import CheckPutClassForGroupLecture from "./CheckPutClassForGroupLecture.js";
import CheckPutClassForGroupPractice from "./CheckPutClassForGroupPractice.js";
import GetIdAudienceForClassLecture from "./GetIdAudienceForClassLecture.js";
import GetIdAudienceForClassPractice from "./GetIdAudienceForClassPractice.js";
import GetPairTypeForClass from "./GetPairTypeForClass.js";
import GetRndInteger from "./GetRndInteger.js";

export default function Mutation(
  individ,
  p_genes,
  max_day,
  max_pair,
  mapGroupAndAG,
  mapTeacherAndAG,
  classes
) {
  individ.forEach((gene) => {
    if (Math.random() < p_genes) {
      let clas = null;
      let group = null;
      for (let cl of classes) {
        clas = cl.assigned_groups.map((ag) => {
          if (ag.id === gene.id_assigned_group) {
            clas = cl;
            group = ag.group;
          }
        });
        if (clas) break;
      }
      let pair_types = GetPairTypeForClass(clas);

      //for (let i = 0; i < pair_types.length; i++) {
      let checkGroup = false;
      let checkTeach = false;
      let checkAud = false;
      while (!checkGroup && !checkTeach && !checkAud) {
        let pair_type = pair_types[i];
        let day_week = GetRndInteger(0, max_day);
        let number_pair = GetRndInteger(0, max_pair);
        checkTeach = CheckPutClassForTeacher(
          clas,
          gene,
          day_week,
          number_pair,
          pair_type,
          mapTeacherAndAG
        );
        checkGroup =
          clas.id_type_class == 1
            ? CheckPutClassForGroupLecture(
                clas,
                schedule,
                day_week,
                number_pair,
                pair_type,
                mapGroupAndAG
              )
            : CheckPutClassForGroupPractice(
                group.id,
                schedule,
                day_week,
                number_pair,
                pair_type,
                mapGroupAndAG
              );
        if (!checkAud)
          id_audience =
            pair_type == 1
              ? GetIdAudienceForClassLecture(clas, audiences)
              : GetIdAudienceForClassPractice(group, clas, audiences);
        //  }

        gene = {
          number_pair,
          day_week,
          pair_type: gene.pair_type,
          id_assigned_group: gene.id_assigned_group,
          id_audience,
        };
      }
    }
  });
  return individ;
}
