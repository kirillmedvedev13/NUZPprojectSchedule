import { gql } from "@apollo/client";
export const ADD_DISCIPLINE_TO_SPECIALTY = gql`
  mutation ($id_discipline: Int!, $semester: Int, $id_specialty: Int) {
    AddDisciplineToSpecialty(
      id_discipline: $id_discipline
      semester: $semester
      id_specialty: $id_specialty
    ) {
      message
      successful
    }
  }
`;
export const DELETE_DISCIPLINE_FROM_SPECIALTY = gql`
  mutation ($id: ID!) {
    DeleteAudience(id: $id) {
      message
      successful
    }
  }
`;
export const DELETE_DISCIPLINE = gql`
  mutation ($id: ID!) {
    DeleteDiscipline(id: $id) {
      message
      successful
    }
  }
`;
export const CREATE_DISCIPLINE = gql`
  mutation ($name: String!, $input: String!) {
    CreateDiscipline(name: $name, input: $input) {
      message
      successful
    }
  }
`;
export const UPDATE_DISCIPLINE = gql`
  mutation ($id: ID!, $name: String!, $input: String!) {
    UpdateDiscipline(id: $id, name: $name, input: $input) {
      message
      successful
    }
  }
`;
