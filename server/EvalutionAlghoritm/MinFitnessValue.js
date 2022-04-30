export default function MinFitnessValue(populations) {
  let min = Number.MAX_VALUE;
  for (let i = 0; i < populations.length; i++) {
    if (populations[i].fitnessValue < min) min = populations[i].fitnessValue;
  }
  return min;
}
