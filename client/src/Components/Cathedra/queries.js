import { gql } from "@apollo/client";

export const GET_ALL_CATHEDRAS = gql`
  query GetAllCathedras($name: String) {
    GetAllCathedras(name: $name) {
      id
      name
    }
  }
`;
