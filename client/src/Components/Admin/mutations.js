import { gql } from "@apollo/client";

export const UPDATE_INFO = gql`
  mutation ($data: String!) {
    UpdateInfo(data: $data) {
      message
      successful
    }
  }
`;
export const DELETE_RESULTS = gql`
  mutation ($name_algorithm: String!) {
    DeleteResults(name_algorithm: $name_algorithm) {
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
  mutation ($id_cathedra: Int) {
    DeleteAllData(id_cathedra: $id_cathedra) {
      message
      successful
    }
  }
`;
export const RUN_ALGORITHM = gql`
  mutation ($name: String!, $id_cathedra: Int) {
    RunAlgorithm(name: $name, id_cathedra: $id_cathedra) {
      message
      successful
    }
  }
`;

export const UPDATE_ALGORITHM = gql`
  mutation ($name: String!, $params: String!) {
    UpdateAlgorithm(name: $name, params: $params) {
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
