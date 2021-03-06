import cloneDeep from "clone-deep";
export default function MinFitnessValue(populations, bestPopulation) {
  let min = Number.MAX_VALUE;
  let min_index;
  for (let i = 0; i < populations.length; i++) {
    if (populations[i].fitnessValue < min) {
      min = populations[i].fitnessValue;
      min_index = i;
    }
  }

  if (bestPopulation.fitnessValue > min) {
    return {
      scheduleForGroups: cloneDeep(populations[min_index].scheduleForGroups),
      fitnessValue: cloneDeep(populations[min_index].fitnessValue),
    };
  }
  return bestPopulation;
}
