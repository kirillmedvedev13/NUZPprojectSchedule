import { GraphQLList } from "graphql";
import db from "../../database.js";
import { GroupType } from "../TypeDefs/GroupType.js";

export const GET_ALL_GROUPS = {
  type: new GraphQLList(GroupType),
  async resolve() {
    return await db.group.findAll({
      include: {
        model: db.specialty,
        required: true,
      },
    });
  },
};
