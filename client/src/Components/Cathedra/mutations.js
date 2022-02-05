import { gql } from "@apollo/client";

export const DELETE_CATHEDRA = gql`
  mutation DeleteCathedra($id: ID!) {
    DeleteCathedra(id: $id) {
      message
      successful
    }
  }
`;
export const UPDATE_CATHEDRA = gql`
  mutation UpdateCathedra($id: ID!, $name: String!, $short_name: String) {
    UpdateCathedra(id: $id, name: $name, short_name: $short_name) {
      message
      successful
    }
  }
`;
export const CREATE_CATHEDRA = gql`
  mutation CreateCathedra($name: String, $short_name: String) {
    CreateCathedra(name: $name, short_name: $short_name) {
      message
      successful
    }
  }
`;
