import { gql } from "@apollo/client";
export const GET_INFO = gql`
  query {
    GetInfo {
      max_day
      max_pair
      fitness_value
      general_values
    }
  }
`;
export const GET_ALL_ALGORITHM = gql`
  query {
    GetAllAlgorithm {
      name
      label
      params
      results_algorithms {
        params_value
        results
      }
    }
  }
`;
export const GET_ALL_SCHEDULE = gql`
  query {
    GetAllSchedule {
      id
      number_pair
      day_week
      pair_type
      audience {
        id
      }
      class {
        id
        type_class {
          id
        }
        times_per_week
        recommended_schedules {
          number_pair
          day_week
        }
        assigned_groups {
          group {
            id
            number_students
          }
        }
        assigned_teachers {
          teacher {
            id
          }
        }
        recommended_audiences {
          audience {
            id
          }
        }
      }
    }
  }
`;
