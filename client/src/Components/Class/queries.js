import { gql } from "@apollo/client";

export const GET_ALL_CLASSES = gql`
  query ($id_discipline: Int, $id_group: Int, $id_teacher: Int) {
    GetAllClasses(
      id_discipline: $id_discipline
      id_group: $id_group
      id_teacher: $id_teacher
    ) {
      id
      assigned_discipline {
        discipline {
          name
        }
        specialty {
          name
        }
      }
      type_class {
        name
      }
      times_per_week
      assigned_groups {
        group {
          id
          name
        }
      }
      assigned_teachers {
        teacher {
          id
          patronymic
          surname
          name
          cathedra {
            name
          }
        }
      }
      recommended_audiences {
        audience {
          id
          name
        }
      }
    }
  }
`;
