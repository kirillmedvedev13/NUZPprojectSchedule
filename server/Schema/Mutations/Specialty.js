import { GraphQLInt, GraphQLString, GraphQLID } from "graphql";
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

export const DELETE_SPECIALTY = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, { id }) {
    let res = await db.specialty.destroy({
      where: {
        id,
      },
    });
    return res
      ? { successful: true, message: "Specialty was deleted" }
      : { successful: false, message: "Specialty wasn`t deleted" };
  },
};

export const UPDATE_SPECIALTY = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    id_cathedra: { type: GraphQLInt },
  },
  async resolve(parent, { id,name, id_cathedra }) {
    let res = await db.specialty.update(
      { name, id_cathedra },
      {
        where: {
          id,
        },
      }
    );
    return res[0]
      ? { successful: true, message: "Specialty was updated" }
      : { successful: false, message: "Specialty wasn`t updated" };
  },
};