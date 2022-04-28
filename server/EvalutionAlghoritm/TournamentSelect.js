import GetRndInteger from "./GetRndInteger.js";
export default function TournamentSelect(populations, population_size) {
  let newPopulations = [];
  while (newPopulations.length < population_size) {
    let i1 = 0;
    let i2 = i1;
    let i3 = i1;
    while (i1 == i2 || i2 == i3 || i1 == i3) {
      i1 = GetRndInteger(0, population_size - 1);
      i2 = GetRndInteger(0, population_size - 1);
      i3 = GetRndInteger(0, population_size - 1);
    }
    newPopulations.push(
      maxFitnessValue(populations[i1], populations[i2], populations[i3])
    );
  }
  return newPopulations;
}

function maxFitnessValue(individ1, individ2, individ3) {
  if (
    individ1.fitnessValue > individ2.fitnessValue &&
    individ1.fitnessValue > individ3.fitnessValue
  )
    return individ1;
  else if (
    individ1.fitnessValue < individ2.fitnessValue &&
    individ1.fitnessValue > individ3.fitnessValue
  )
    return individ2;
  else return individ3;
}
