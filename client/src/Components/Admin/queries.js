import { gql } from "@apollo/client";
export const GET_INFO = gql`
  query {
    GetInfo {
      max_day
      max_pair
      fitness_value
      population_size
      max_generations
      p_crossover
      p_mutation
      p_genes
      penaltyGrWin
      penaltyTeachWin
      penaltyLateSc
      penaltyEqSc
      penaltySameTimesSc
      p_elitism
    }
  }
`;
