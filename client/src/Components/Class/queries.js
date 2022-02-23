import { gql } from "@apollo/client";

export const GET_ALL_CLASSES = gql`
  query (
    $id_discipline: Int
    $id_group: Int
    $id_teacher: Int
    $id_specialty: Int
    $semester: Int
  ) {
    GetAllClasses(
      id_discipline: $id_discipline
      id_group: $id_group
      id_teacher: $id_teacher
      id_specialty: $id_specialty
      semester: $semester
    ) {
      id
      times_per_week
      assigned_discipline {
        id
        semester
        discipline {
          id
          name
        }
        specialty {
          id
          name
          code
          cathedra {
            short_name
          }
        }
      }
      type_class {
        id
        name
      }
      assigned_groups {
        id
        group {
          id
          name
        }
      }
      assigned_teachers {
        id
        teacher {
          id
          name
          surname
          patronymic
          cathedra {
            name
            short_name
          }
        }
      }
      recommended_audiences {
        id
        audience {
          id
          name
        }
      }
    }
  }
`;
export const GET_ALL_TYPE_CLASSES = gql`
  query {
    GetAllTypeClasses {
      id
      name
    }
  }
`;
