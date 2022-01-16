import { gql } from "@apollo/client";
export const GET_ALL_TEACHERS = gql`
  query ($surname: String) {
    GetAllTeachers(surname: $surname) {
      id
      name
      surname
      patronymic
    }
  }
`;
