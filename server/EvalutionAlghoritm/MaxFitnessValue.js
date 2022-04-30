export default function MaxFitnessValue(
  populations,
  mapGroupAndAG,
  mapTeacherAndAG
) {
  populations.sort(function (individ1, individ2) {
    if (individ1.fitnessValue > individ2.fitnessValue) return 1;
    else if (individ1.fitnessValue == individ2.fitnessValue) return 0;
    else return -1;
  });
  return populations[0].fitnessValue;
}
