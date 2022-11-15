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
  mutation ($id_cathedra: Int) {
    DeleteAllData(id_cathedra: $id_cathedra) {
      message
      successful
    }
  }
`;
export const RUN_EA = gql`
  mutation ($id_cathedra: Int) {
    RunEA(id_cathedra: $id_cathedra) {
      message
      successful
    }
  }
`;
export const RUN_EACpp = gql`
  mutation ($id_cathedra: Int) {
    RunEACpp(id_cathedra: $id_cathedra) {
      message
      successful
    }
  }
`;
export const RUN_SA = gql`
  mutation ($id_cathedra: Int) {
    RunSA(id_cathedra: $id_cathedra) {
      message
      successful
    }
  }
`;
export const RUN_SIMULATED_ANNEALING = gql`
  mutation ($id_cathedra: Int) {
    RunSimulatedAnnealing(id_cathedra: $id_cathedra) {
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
