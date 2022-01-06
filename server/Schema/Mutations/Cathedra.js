import { GraphQLID, GraphQLString } from "graphql";
import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";

export const CREATE_CATHEDRA = {
  type: MessageType,
  args: {
    name: { type: GraphQLString },
  },
  async resolve(parent, { name, surname, patronymic }) {
    let res = await db.cathedras.create({
      name,
    });
    return res
      ? { successful: true, message: "Cathedra was created" }
      : { successful: false, message: "Cathedra wasn`t created" };
  },
};

export const DELETE_CATHEDRA = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, { id }) {
    let res = await db.cathedras.destroy({
      where: {
        id,
      },
    });
    return res
      ? { successful: true, message: "Cathedra was deleted" }
      : { successful: false, message: "Cathedra wasn`t deleted" };
  },
};

export const UPDATE_CATHEDRA = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  },
  async resolve(parent, { id, name }) {
    let res = await db.cathedras.update(
      { name },
      {
        where: {
          id,
        },
      }
    );
    return res[0]
      ? { successful: true, message: "Cathedra was updated" }
      : { successful: false, message: "Cathedra wasn`t updated" };
  },
};
