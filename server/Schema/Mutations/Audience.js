import { GraphQLID, GraphQLInt, GraphQLString } from "graphql";
import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";

export const CREATE_AUDIENCE = {
  type: MessageType,
  args: {
    audience_number: { type: GraphQLString },
    type: { type: GraphQLString },
    capacity: { type: GraphQLInt },
  },
  async resolve(parent, { audience_number, type, capacity }) {
    let res = await db.audience.create({
      audience_number,
      type,
      capacity,
    });
    return res
      ? { successful: true, message: "Audience was created" }
      : { successful: false, message: "Audience wasn`t created" };
  },
};

export const UPDATE_AUDIENCE = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
    audience_number: { type: GraphQLString },
    type: { type: GraphQLString },
    capacity: { type: GraphQLInt },
  },
  async resolve(parent, { id, audience_number, type, capacity }) {
    let res = await db.audience.update(
      { audience_number, type, capacity },
      {
        where: {
          id,
        },
      }
    );
    return res[0]
      ? { successful: true, message: "Audience was updated" }
      : { successful: false, message: "Audience wasn`t updated" };
  },
};
