import { gql } from "@apollo/client";
export const GET_ALL_GROUPS = gql`
  query ($name: String, $id_specialty: Int) {
    GetAllGroups(name: $name, id_specialty: $id_specialty) {
      id
      name
      number_students
      semester
      specialty {
        id
        name
      }
    }
  }
`;
