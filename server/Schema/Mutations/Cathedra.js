import { GraphQLID, GraphQLString } from "graphql";
import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";

export const CREATE_CATHEDRA = {
  type: MessageType,
  args: {
    name: { type: GraphQLString },
    short_name: { type: GraphQLString },
  },
  async resolve(parent, { name, short_name }) {
    let res = await db.cathedra.create({
      name,
      short_name,
    });
    return res
      ? { successful: true, message: "Запис кафедри успішно створено" }
      : { successful: false, message: "Помилка при створенні запису кафедри" };
  },
};

export const DELETE_CATHEDRA = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, { id }) {
    let res = await db.cathedra.destroy({
      where: {
        id,
      },
    });
    return res
      ? { successful: true, message: "Запис кафедри успішно видалено" }
      : { successful: false, message: "Помилка при видаленні запису кафедри" };
  },
};

export const UPDATE_CATHEDRA = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    short_name: { type: GraphQLString },
  },
  async resolve(parent, { id, name }) {
    let res = await db.cathedra.update(
      { name, short_name },
      {
        where: {
          id,
        },
      }
    );
    return res[0]
      ? { successful: true, message: "Запис кафедри успішно оновлено" }
      : { successful: false, message: "Помилка при оновленні запису кафедри" };
  },
};
