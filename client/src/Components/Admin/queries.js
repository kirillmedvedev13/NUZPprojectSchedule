import { gql } from "@apollo/client";
export const GET_INFO = gql`
  query {
    GetInfo {
      max_day
      max_pair
      fitness_value
      general_values
      evolution_values
      simulated_annealing
    }
  }
`;
