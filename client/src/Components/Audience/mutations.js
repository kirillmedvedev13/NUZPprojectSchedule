import { gql } from "@apollo/client";

export const DELETE_GROUP = gql`
  mutation ($id: ID!) {
    DeleteGroup(id: $id) {
      message
      successful
    }
  }
`;
export const UPDATE_GROUP = gql`
  mutation (
    $id: ID!
    $name: String!
    $id_specialty: Int!
    $semester: Int!
    $number_students: Int!
  ) {
    UpdateGroup(
      id: $id
      name: $name
      id_specialty: $id_specialty
      semester: $semester
      number_students: $number_students
    ) {
      message
      successful
    }
  }
`;
export const CREATE_GROUP = gql`
  mutation (
    $name: String!
    $id_specialty: Int!
    $semester: Int!
    $number_students: Int!
  ) {
    CreateGroup(
      name: $name
      id_specialty: $id_specialty
      semester: $semester
      number_students: $number_students
    ) {
      message
      successful
    }
  }
`;
