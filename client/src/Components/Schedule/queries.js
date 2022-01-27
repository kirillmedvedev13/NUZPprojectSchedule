import { gql } from "@apollo/client";

export const GET_ALL_GROUP_SCHEDULES = gql`
  query {
    GetAllGroupSchedules {
      id
      name
      assigned_groups {
        schedules {
          id
          number_pair
          day_week {
            id
            name
          }
          pair_type {
            id
            parity
          }
          audience {
            id
            name
          }
          assigned_group {
            class {
              type_class {
                id
                name
              }
              assigned_discipline {
                discipline {
                  id
                  name
                }
              }
              assigned_teachers {
                teacher {
                  id
                  surname
                  name
                  patronymic
                  cathedra {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_WEEKS_DAY = gql`
  query {
    GetWeeksDay {
      id
      name
    }
  }
`;
