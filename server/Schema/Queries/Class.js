import { GraphQLList } from "graphql";
import db from "../../database.js";
import ClassType from "../TypeDefs/ClassType.js";

export const GET_ALL_CLASSES = {
  type: new GraphQLList(ClassType),
  async resolve() {
    let res = await db.class.findAll({
      include: [
        {
          model: db.type_class,
        },
        {
          model: db.assigned_discipline,
          include: [
            {
              model: db.discipline,
            },
            {
              model: db.specialty,
            },
          ],
        },
        {
          model: db.assigned_teacher,
          include: {
            model: db.teacher,
            include: {
              model: db.cathedra,
            },
          },
        },
        {
          model: db.assigned_group,
          include: {
            model: db.group,
          },
        },
      ],
    });
    console.log(res);
    return res;
  },
};
/*query{
  GetAllClasses {
    assigned_discipline {
      discipline {
        name
      }
    }
    type_class {
      name
    }
    times_per_week
    assigned_groups {
      group {
        name
      }
  }
    assigned_teachers {
      teacher {
        patronymic
        name
        cathedra {
          name
        }
      }
    }
  }
}
 */
