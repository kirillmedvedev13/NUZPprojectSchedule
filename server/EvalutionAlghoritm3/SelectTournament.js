export default function SelectTournament(population1, population2, population3) {
  if (
    population1.fitnessValue < population2.fitnessValue &&
    population1.fitnessValue < population3.fitnessValue
  )
    return population1.index;
  else if (
    population1.fitnessValue > population2.fitnessValue &&
    population3.fitnessValue > population2.fitnessValue
  )
    return population2.index;
  else return population3.index;
}
