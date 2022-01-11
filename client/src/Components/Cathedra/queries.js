import { gql } from "@apollo/client";

export const GetAllCathedras = gql`
  query GetAllCathedras($name: String) {
    GetAllCathedras(name: $name) {
      id
      name
    }
  }
`;
