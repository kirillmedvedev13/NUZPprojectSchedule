import { gql } from "@apollo/client";

export const GET_ALL_TYPE_CLASSES = gql`
  query {
    GetAllTypeClasses {
      id
      name
    }
  }
`;
export const GET_ALL_ASSIGNED_DISCIPLINES = gql`
  query {
    GetAllAssignedDisciplines {
      id
      semester
      discipline {
        id
        name
      }
      specialty {
        id
        name
      }
    }
  }
`;
