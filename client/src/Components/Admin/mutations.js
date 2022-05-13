import { gql } from "@apollo/client";

export const UPDATE_INFO = gql`
  mutation (
    $population_size: Int!,
    $max_generations: Int!,
    $p_crossover: Double!,
    $p_mutation: Double!,
    $p_genes: Double!,
    $penaltyGrWin: Double!,
    $penaltyTeachWin: Double!,
    $penaltyLateSc: Double!,
    $penaltyEqSc: Double!,
    $penaltySameTimesSc: Double!
    ){
      UpdateInfo(
        population_size: $population_size,
        max_generations: $max_generations,
        p_crossover: $p_crossover,
        p_mutation: $p_mutation,
        p_genes: $p_genes,
        penaltyGrWin: $penaltyGrWin,
        penaltyTeachWin: $penaltyTeachWin,
        penaltyLateSc: $penaltyLateSc,
        penaltyEqSc: $penaltyEqSc,
        penaltySameTimesSc: $penaltySameTimesSc
      )
      {
        message
        successful
      }
    }
`;

export const SET_CLASSES = gql`
  mutation ($data: String!, $id_cathedra: Int!) {
    SetClasses(data: $data, id_cathedra: $id_cathedra) {
      message
      successful
    }
  }
`;
export const DELETE_ALL_DATA = gql`
  mutation {
    DeleteAllData {
      message
      successful
    }
  }
`;
export const RUN_EA = gql`
  mutation {
    RunEA {
      message
      successful
    }
  }
`;
