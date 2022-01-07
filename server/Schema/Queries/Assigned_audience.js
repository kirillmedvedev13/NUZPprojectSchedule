import { GraphQLList } from "graphql";
import db from "../../database.js";
import Assigned_audienceType from "../TypeDefs/Assigned_audienceType.js";

export const GET_ALL_ASSIGNED_AUDIENCES = {
  type: new GraphQLList(Assigned_audienceType),
  async resolve() {
    return await db.assigned_audience.findAll();
  },
};
