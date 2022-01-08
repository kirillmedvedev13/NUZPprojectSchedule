import { GraphQLID, GraphQLInt, GraphQLString } from "graphql";
import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";

export const CREATE_AUDIENCE = {
  type: MessageType,
  args: {
    name: { type: GraphQLString },
    capacity: { type: GraphQLInt },
    id_type_class: {type : GraphQLInt}
  },
  async resolve(parent, { name, capacity, id_type_class}) {
    let res = await db.audience.create({
      name,
      capacity,
      id_type_class,
    });
    return res
      ? { successful: true, message: "Audience was created" }
      : { successful: false, message: "Audience wasn`t created" };
  },
};

export const DELETE_AUDIENCE = {
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
      ? { successful: true, message: "Audience was deleted" }
      : { successful: false, message: "Audience wasn`t deleted" };
  },
};

export const UPDATE_AUDIENCE = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    capacity: { type: GraphQLInt },
    id_type_class: {type : GraphQLInt}
  },
  async resolve(parent, { id,name,capacity, id_type_class, }) {
    let res = await db.audience.update(
      { name, id_type_class, id_type_class },
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
