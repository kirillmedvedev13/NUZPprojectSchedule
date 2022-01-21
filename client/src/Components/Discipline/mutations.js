import { gql } from "@apollo/client";

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
