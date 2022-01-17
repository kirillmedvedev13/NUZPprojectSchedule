import { gql } from "@apollo/client";

export const DELETE_DISCIPLINE = gql`
  mutation ($id: ID!) {
    DeleteDiscipline(id: $id) {
      message
      successful
    }
  }
`;
