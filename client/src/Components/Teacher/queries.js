import { gql } from "@apollo/client";
export const GET_ALL_TEACHERS = gql`
  query ($surname: String, $id_cathedra: Int) {
    GetAllTeachers(surname: $surname, id_cathedra: $id_cathedra) {
      id
      name
      surname
      patronymic
      cathedra {
        id
        name
        short_name
      }
    }
  }
`;
