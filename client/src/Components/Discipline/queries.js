import { gql } from "@apollo/client";
export const GET_ALL_DISCIPLINES = gql`
  query ($name: String, $id_cathedra: Int) {
    GetAllDicsiplines(name: $name, id_cathedra: $id_cathedra) {
      name
      id
      cathedra {
        id
        name
      }
    }
  }
`;
