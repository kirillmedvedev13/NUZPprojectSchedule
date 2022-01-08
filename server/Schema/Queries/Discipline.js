import { GraphQLList } from "graphql";
import db from "../../database.js";
import { DisciplineType } from "../TypeDefs/DisciplineType.js";

export const GET_ALL_DISCIPLINES = {
  type: new GraphQLList(DisciplineType),
  async resolve() {
    return await db.discipline.findAll({
      include: {
        model: db.specialty,
        required: true,
        include: {
          model: db.cathedra,
          required: true,
        }
      },
    });
  },
};
