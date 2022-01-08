import { GraphQLList } from "graphql";
import db from "../../database.js";
import { DisciplineType } from "../TypeDefs/DisciplineType.js";

export const GET_ALL_DISCIPLINES = {
  type: new GraphQLList(DisciplineType),
  async resolve() {
    let res = await db.discipline.findAll({
      include: {
        model: db.assigned_discipline,
        include: {
          model: db.specialty,
        },
      },
    });
    return res;
  },
};
