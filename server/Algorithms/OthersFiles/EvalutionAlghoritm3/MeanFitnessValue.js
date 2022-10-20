export default function MeanFitnessValue(populations) {
  let sum = 0;
  for (let i = 0; i < populations.length; i++) {
    sum += populations[i].fitnessValue;
  }
  return sum / populations.length;
}
