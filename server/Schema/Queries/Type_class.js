import { GraphQLList } from "graphql";
import db from "../../database.js";
import Type_classType from "../TypeDefs/Type_classType.js";

export const GET_ALL_TYPE_CLASSES = {
  type: new GraphQLList(Type_classType),
  async resolve() {
    return await db.type_class.findAll();
  },
};
