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
          inlcude: {
            model: db.discipline,
          },
        },
      ],
    });
    console.log(res);
    return res;
  },
};
