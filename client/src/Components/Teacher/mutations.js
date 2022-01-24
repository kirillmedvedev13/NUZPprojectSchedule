import { gql } from "@apollo/client";

export const DELETE_TEACHER = gql`
  mutation ($id: Int!) {
    DeleteTeacher(id: $id) {
      message
      successful
    }
  }
`;
export const UPDATE_TEACHER = gql`
  mutation (
    $id: Int!
    $name: String
    $surname: String
    $patronymic: String
    $id_cathedra: Int
  ) {
    UpdateTeacher(
      id: $id
      name: $name
      surname: $surname
      patronymic: $patronymic
      id_cathedra: $id_cathedra
    ) {
      message
      successful
    }
  }
`;
export const CREATE_TEACHER = gql`
  mutation (
    $name: String
    $surname: String
    $patronymic: String
    $id_cathedra: Int
  ) {
    CreateTeacher(
      name: $name
      surname: $surname
      patronymic: $patronymic
      id_cathedra: $id_cathedra
    ) {
      message
      successful
    }
  }
`;
