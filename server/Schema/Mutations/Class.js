import { GraphQLFloat, GraphQLInt, GraphQLString } from "graphql";
import MessageType from "../TypeDefs/MessageType.js";

export const CREATE_CLASS = {
  type: MessageType,
  args: {
    id_type_class: { type: GraphQLString },
    times_per_week: { type: GraphQLFloat },
    id_assigned_discipline: { type: GraphQLInt },
  },
  async resolve(
    parent,
    { id_type_class, times_per_week, id_assigned_discipline }
  ) {
    let res = await db.classes.create({
      id_type_class,
      times_per_week,
      id_assigned_discipline,
    });
    return res
      ? { successful: true, message: "Class was created" }
      : { successful: false, message: "Class wasn`t created" };
  },
};
