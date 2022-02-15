import { gql } from "@apollo/client";

export const SET_CLASSES = gql`
  mutation ($data: String!, $id_cathedra: Int!) {
    SetClasses(data: $data, id_cathedra: $id_cathedra) {
      message
      successful
    }
  }
`;
export const DELETE_ALL_DATA = gql`
  mutation {
    DeleteAllData {
      message
      successful
    }
  }
`;
