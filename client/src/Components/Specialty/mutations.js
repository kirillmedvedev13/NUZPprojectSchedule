import { gql } from "@apollo/client";

export const DELETE_SPECIALTY = gql`
  mutation ($id: ID!) {
    DeleteSpecialty(id: $id) {
      message
      successful
    }
  }
`;
export const UPDATE_SPECIALTY = gql`
  mutation ($id: ID!, $name: String!, $id_cathedra: Int!, $code: Int) {
    UpdateSpecialty(id: $id, name: $name, id_cathedra: $id_cathedra, code: $code) {
      message
      successful
    }
  }
`;
export const CREATE_SPECIALTY = gql`
  mutation ($name: String, $id_cathedra: Int, $code: Int) {
    CreateSpecialty(name: $name, id_cathedra: $id_cathedra, code: $code) {
      message
      successful
    }
  }
`;
