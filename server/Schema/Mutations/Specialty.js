import { GraphQLInt, GraphQLString } from "graphql";
import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";

export const CREATE_SPECIALTY = {
  type: MessageType,
  args: {
    name: { type: GraphQLString },
    id_cathedra: { type: GraphQLInt },
  },
  async resolve(parent, { name, id_cathedra }) {
    let res = await db.specialty.create({ name, id_cathedra });
    return res
      ? { successful: true, message: "Specialty was created" }
      : { successful: false, message: "Specialty wasn`t created" };
  },
};
