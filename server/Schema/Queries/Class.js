import { GraphQLList, GraphQLInt } from "graphql";
import db from "../../database.js";
import { Op } from "sequelize";
import ClassType from "../TypeDefs/ClassType.js";

export const GET_ALL_CLASSES = {
  type: new GraphQLList(ClassType),
  args: {
    id_group: { type: GraphQLInt },
    id_discipline: { type: GraphQLInt },
    id_teacher: { type: GraphQLInt },
  },
  async resolve(parent, { id_group, id_discipline, id_teacher }) {
    console.log({ id_group, id_discipline, id_teacher });
    const isFilterGroup = id_group ? { id_group: { [Op.eq]: id_group } } : {};
    const isFilterDisc = id_group
      ? { id_discipline: { [Op.eq]: id_discipline } }
      : {};
    const isFilterTeach = id_group
      ? { id_teacher: { [Op.eq]: id_teacher } }
      : {};
    let res = await db.class.findAll({
      include: [
        {
          model: db.type_class,
        },
        {
          model: db.assigned_discipline,
          where: isFilterDisc,
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
          where: isFilterTeach,
          include: {
            model: db.teacher,
            include: {
              model: db.cathedra,
            },
          },
        },
        {
          model: db.assigned_group,
          where: isFilterGroup,
          include: {
            model: db.group,
          },
        },
        {
          model: db.recommended_audience,
          include: {
            model: db.audience,
          },
        },
      ],
    });
    return res;
  },
};
/*query{
  GetAllClasses {
    assigned_discipline {
      discipline {
        name
        
      }
      specialty{
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
    recommended_audiences{
      audience{
        name
      }
    }
  }
}

 */
