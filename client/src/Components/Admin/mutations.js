import { gql } from "@apollo/client";

export const UPDATE_INFO = gql`
  mutation ($data: String!) {
    UpdateInfo(data: $data) {
      message
      successful
    }
  }
`;

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
export const RUN_EA = gql`
  mutation {
    RunEA {
      message
      successful
    }
  }
`;
export const CALC_FITNESS = gql`
  mutation {
    CalcFitness {
      message
      successful
    }
  }
`;
