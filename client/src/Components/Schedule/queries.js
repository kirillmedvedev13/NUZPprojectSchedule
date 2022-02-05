import { gql } from "@apollo/client";

export const GET_ALL_SCHEDULE_GROUPS = gql`
  query ($id_cathedra: Int, $id_group: Int, $id_specialty: Int) {
    GetAllScheduleGroups(
      id_cathedra: $id_cathedra
      id_group: $id_group
      id_specialty: $id_specialty
    ) {
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

export const GET_ALL_SCHEDULE_AUDIENCES = gql`
  query ($id_cathedra: Int, $id_audience: Int) {
    GetAllScheduleAudiences(
      id_cathedra: $id_cathedra
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

export const GET_ALL_SCHEDULE_TEACHERS = gql`
query($id_teacher:Int, $id_cathedra: Int){
  GetAllScheduleTeachers(id_teacher: $id_teacher, id_cathedra: $id_cathedra) {
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
`