import { GraphQLList } from "graphql";
import db from "../../database.js";
import Day_weekType from "../TypeDefs/Day_weekType.js";

export const GET_WEEKS_DAY = {
  type: new GraphQLList(Day_weekType),
  async resolve() {
    return await db.day_week.findAll();
  },
};
