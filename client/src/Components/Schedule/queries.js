import { gql } from "@apollo/client";

export const GET_INFO = gql`
  query {
    GetInfo {
      max_day
      max_pair
    }
  }
`;

export const GET_ALL_SCHEDULE_GROUPS = gql`
  query ($id_cathedra: Int, $id_specialty: Int, $id_group: Int, $semester: Int) {
  GetAllScheduleGroups(id_cathedra: $id_cathedra, id_specialty: $id_specialty, id_group:$id_group, semester: $semester) {
    id
    name
    specialty {
      cathedra {
        name
      }
    }
    assigned_groups {
      class {
        type_class {
          name
        }
        times_per_week
        assigned_discipline {
          discipline {
            name
          }
        }
        assigned_teachers {
          teacher {
            surname
            name
            patronymic
          }
        }
        schedules {
          number_pair
          day_week
          pair_type
          audience {
            name
          }
        }
      }
    }
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
        day_week
        pair_type
        class {
          id
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
          assigned_groups {
            group {
              id
              name
              specialty {
                cathedra {
                  short_name
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
  query ($id_teacher: Int, $id_cathedra: Int) {
    GetAllScheduleTeachers(id_teacher: $id_teacher, id_cathedra: $id_cathedra) {
      id
      surname
      name
      patronymic
      cathedra {
        name
      }
      assigned_teachers {
        class {
          id
          schedules {
            id
            number_pair
            day_week
            pair_type
            audience {
              id
              name
            }
          }
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

          assigned_groups {
            group {
              id
              name
              specialty {
                cathedra {
                  short_name
                }
              }
            }
          }
        }
      }
    }
  }
`;
