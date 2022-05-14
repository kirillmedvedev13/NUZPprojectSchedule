import { gql } from "@apollo/client";
export const GET_INFO = gql`
  query {
    GetInfo {
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
export const GET_FITNESS = gql`
  query {
    GetFitness {
      message
      successful
    }
  }
`;
