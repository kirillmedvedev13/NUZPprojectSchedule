import { GraphQLList } from "graphql";
import db from "../../database.js";
import AudienceType from "../TypeDefs/AudienceType.js";

export const GET_ALL_AUDIENCES = {
  type: new GraphQLList(AudienceType),
  async resolve() {
    let res =  await db.audience.findAll({
      include: {
        model: db.type_class,
        required: true,
      }
    });
    return res;
  },
};
