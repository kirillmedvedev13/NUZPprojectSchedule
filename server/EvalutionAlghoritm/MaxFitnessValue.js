export default function MaxFitnessValue(populations) {
  populations.sort(function (individ1, individ2) {
    individ1.fitnessValue = fitness(individ1, mapGroupAndAG, mapTeacherAndAG);
    individ2.fitnessValue = fitness(individ2, mapGroupAndAG, mapTeacherAndAG);
    if (individ1.fitnessValue > individ2.fitnessValue) return 1;
    else if (individ1.fitnessValue == individ2.fitnessValue) return 0;
    else return -1;
  });
  return populations[0].fitnessValue;
}
