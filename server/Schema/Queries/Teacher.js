import { GraphQLList } from "graphql";
import db from "../../database.js";
import TeacherType from "../TypeDefs/TeacherType.js";

export const GET_ALL_TEACHERS = {
  type: new GraphQLList(TeacherType),
  async resolve() {
    let res = await db.teacher.findAll({
      include: {
        model: db.assigned_teacher,
        include: {
          model: db.class,
          include: [
            {
              model: db.type_class,
            },
            {
              model: db.assigned_discipline,
              include: {
                model: db.discipline,
              },
            },
          ],
        },
      },
    });
    console.log(res);
    return res;
  },
};
