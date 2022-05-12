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
    bestPopulation = populations[min_index];
  }
  return { bestFitnessValue: min, bestPopulation };
}
