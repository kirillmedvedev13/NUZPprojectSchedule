import { GraphQLList } from "graphql";
import db from "../../database.js";
import CathedraType from "../TypeDefs/CathedraType.js";

export const GET_ALL_CATHEDRAS = {
  type: new GraphQLList(CathedraType),
  async resolve() {
    return await db.cathedras.findAll();
  },
};
