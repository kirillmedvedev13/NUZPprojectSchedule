import { GraphQLID, GraphQLInt, GraphQLString } from "graphql";
import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";

export const CREATE_ASSIGNED_AUDIENCE = {
  type: MessageType,
  args: {
    id_audience: { type: GraphQLInt },
    id_cathedra: { type: GraphQLInt },
  },
  async resolve(parent, { id_audience, id_cathedra }) {
    let res = await db.assigned_audience.create({
        id_audience,
        id_cathedra,
    });
    return res
      ? { successful: true, message: "Audience was assigned to cathedra" }
      : { successful: false, message: "Audience wasn`t assigned to cathedra" };
  },
};

export const DELETE_ASSIGNED_AUDIENCE = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, { id }) {
    let res = await db.audience.destroy({
      where: {
        id,
      },
    });
    return res
      ? { successful: true, message: "Binding audience-cathedra was deleted" }
      : { successful: false, message: "Binding audience-cathedra wasn`t deleted" };
  },
};
