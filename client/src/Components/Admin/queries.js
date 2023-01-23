import { gql } from "@apollo/client";
export const GET_INFO = gql`
  query {
    GetInfo {
      max_day
      max_pair
      fitness_value
      general_values
    }
  }
`;
export const GET_ALL_ALGORITHM = gql`
  query {
    GetInfo {
      max_day
      max_pair
      fitness_value
      general_values
    }
  }
`;
