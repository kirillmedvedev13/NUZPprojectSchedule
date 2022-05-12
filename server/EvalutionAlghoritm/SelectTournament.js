import GetRndInteger from "./GetRndInteger.js";
import cloneDeep from "lodash/clonedeep.js";

export default function SelectTournament(populations, population_size) {
  let newPopulations = new Array(population_size);
  for (let i = 0; i < population_size; i++) {
    let i1 = 0;
    let i2 = i1;
    let i3 = i1;
    while (i1 == i2 || i2 == i3 || i1 == i3) {
      i1 = GetRndInteger(0, populations.length - 1);
      i2 = GetRndInteger(0, populations.length - 1);
      i3 = GetRndInteger(0, populations.length - 1);
    }
    newPopulations[i] = (
      bestFitnessValue(populations[i1], populations[i2], populations[i3])
    );
  }
  return newPopulations;
}

function bestFitnessValue(individ1, individ2, individ3) {
  if (
    individ1.fitnessValue < individ2.fitnessValue &&
    individ1.fitnessValue < individ3.fitnessValue
  )
    return cloneDeep(individ1);
  else if (
    individ1.fitnessValue > individ2.fitnessValue &&
    individ3.fitnessValue > individ2.fitnessValue
  )
    return cloneDeep(individ2);
  else return cloneDeep(individ3);
}
