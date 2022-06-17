import { gql } from "@apollo/client";

export const DELETE_AUDIENCE = gql`
  mutation ($id: ID!) {
    DeleteAudience(id: $id) {
      message
      successful
    }
  }
`;
export const UPDATE_AUDIENCE = gql`
  mutation ($id: ID!, $name: String!, $capacity: Int!, $id_type_class: Int!) {
    UpdateAudience(
      id: $id
      name: $name
      capacity: $capacity
      id_type_class: $id_type_class
    ) {
      message
      successful
    }
  }
`;
export const CREATE_AUDIENCE = gql`
  mutation (
    $name: String!
    $capacity: Int!
    $id_type_class: Int!
    $assigned_cathedras: String
  ) {
    CreateAudience(
      name: $name
      capacity: $capacity
      id_type_class: $id_type_class
      assigned_cathedras: $assigned_cathedras
    ) {
      message
      successful
    }
  }
`;

export const ADD_CATHEDRA_TO_AUDIENCE = gql`
  mutation ($id_audience: ID!, $id_cathedra: ID!) {
    AddCathedraToAudience(
      id_audience: $id_audience
      id_cathedra: $id_cathedra
    ) {
      message
      successful
      data
    }
  }
`;

export const DELETE_CATHEDRA_FROM_AUDIENCE = gql`
  mutation ($id: ID!) {
    DeleteCathedraFromAudience(id: $id) {
      message
      successful
    }
  }
`;
