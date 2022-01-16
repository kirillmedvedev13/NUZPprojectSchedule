import { gql } from "@apollo/client";

export const DELETE_TEACHER = gql`
  mutation ($id: ID!) {
    DeleteTeacher(id: $id) {
      message
      successful
    }
  }
`;
export const UPDATE_TEACHER = gql`
  mutation ($id: ID!, $name: String, $surname: String, $patronymic: String) {
    UpdateTeacher(
      id: $id
      name: $name
      surname: $surname
      patronymic: $patronymic
    ) {
      message
      successful
    }
  }
`;
export const CREATE_TEACHER = gql`
  mutation ($name: String, $surname: String, $patronymic: String) {
    CreateTeacher(name: $name, surname: $surname, patronymic: $patronymic) {
      message
      successful
    }
  }
`;
