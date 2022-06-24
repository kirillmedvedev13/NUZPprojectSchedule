import { gql } from "@apollo/client";
export const GET_ALL_AUDIENCES = gql`
  query ($name: String, $id_cathedra: Int) {
    GetAllAudiences(name: $name, id_cathedra: $id_cathedra) {
      id
      name
      capacity
      type_class {
        id
        name
      }
      assigned_audiences {
        id
        cathedra {
          id
          name
          short_name
        }
      }
    }
  }
`;