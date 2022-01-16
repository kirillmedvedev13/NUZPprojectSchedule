import { gql } from "@apollo/client";

export const GET_ALL_DISCIPLINES = gql`
  query ($name: String, $id_specialty: Int) {
    GetAllDisciplines(name: $name, id_specialty: $id_specialty) {
      id
      name
      assigned_disciplines {
        semester
        specialty {
          id
          name
        }
      }
    }
  }
`;
