import { GraphQLList } from "graphql";
import db from "../../database.js";
import Cathedra from "../../Models/Cathedra.js";
import { SpecialtyType } from "../TypeDefs/SpecialtyType.js";

export const GET_ALL_SPECIALTY = {
  type: new GraphQLList(SpecialtyType),
  async resolve() {
    return await db.specialty.findAll({
      include: {
        model: db.cathedra,
        required: true,
      },
    });
  },
};
