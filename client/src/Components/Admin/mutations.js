import { gql } from "@apollo/client";

export const SET_CLASSES = gql`
  mutation ($data: String) {
    SetClasses(data: $data) {
      message
      successful
    }
  }
`;