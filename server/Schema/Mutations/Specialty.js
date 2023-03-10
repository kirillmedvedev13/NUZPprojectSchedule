import { GraphQLInt, GraphQLString, GraphQLID } from "graphql";
import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";

export const CREATE_SPECIALTY = {
  type: MessageType,
  args: {
    name: { type: GraphQLString },
    id_cathedra: { type: GraphQLInt },
    code: { type: GraphQLInt },
  },
  async resolve(parent, { name, id_cathedra, code }) {
    let res = await db.specialty.create({ name, id_cathedra, code });
    return res
      ? { successful: true, message: "Запис спеціальності успішно створено" }
      : {
          successful: false,
          message: "Помилка при створенні запису спеціальності",
        };
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
      ? { successful: true, message: "Запис спеціальності успішно видалено" }
      : {
          successful: false,
          message: "Помилка при видаленні запису спеціальності",
        };
  },
};

export const UPDATE_SPECIALTY = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    id_cathedra: { type: GraphQLInt },
    code: { type: GraphQLInt },
  },
  async resolve(parent, { id, name, id_cathedra, code }) {
    let res = await db.specialty.update(
      { name, id_cathedra, code },
      {
        where: {
          id,
        },
      }
    );
    return res[0]
      ? { successful: true, message: "Запис спеціальності успішно оновлено" }
      : {
          successful: false,
          message: "Помилка при оновленні запису спеціальності",
        };
  },
};
