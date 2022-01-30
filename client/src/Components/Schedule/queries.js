import { gql } from "@apollo/client";

export const GET_ALL_SCHEDULES = gql`
  query {
    GetAllSchedules {
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
        group {
          id
          name
        }
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
`;

export const GET_WEEKS_DAY = gql`
  query {
    GetWeeksDay {
      id
      name
    }
  }
`;

export const GET_ALL_AUDIENCE_SCHEDULES = gql`
  query (
    $id_discipline: Int
    $id_group: Int
    $id_teacher: Int
    $id_audience: Int
  ) {
    GetAllAudienceSchedules(
      id_discipline: $id_discipline
      id_group: $id_group
      id_teacher: $id_teacher
      id_audience: $id_audience
    ) {
      id
      name
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
        assigned_group {
          group {
            id
            name
          }
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
`;
