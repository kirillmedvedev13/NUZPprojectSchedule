import { GraphQLInt, GraphQLString } from "graphql";
import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";

export const CREATE_TEACHER = {
  type: MessageType,
  args: {
    name: { type: GraphQLString },
    surname: { type: GraphQLString },
    patronymic: { type: GraphQLString },
    id_cathedra: { type: GraphQLInt },
  },
  async resolve(parent, { name, surname, patronymic, id_cathedra }) {
    let res = await db.teacher.create({
      name,
      surname,
      patronymic,
      id_cathedra,
    });
    return res
      ? { successful: true, message: "Teacher was created" }
      : { successful: false, message: "Teacher wasn`t created" };
  },
};

export const DELETE_TEACHER = {
  type: MessageType,
  args: {
    id: { type: GraphQLInt },
  },
  async resolve(parent, { id }) {
    let res = await db.teacher.destroy({
      where: {
        id,
      },
    });
    return res
      ? { successful: true, message: "Teacher was deleted" }
      : { successful: false, message: "Teacher wasn`t deleted" };
  },
};

export const UPDATE_TEACHER = {
  type: MessageType,
  args: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    surname: { type: GraphQLString },
    patronymic: { type: GraphQLString },
    id_cathedra: { type: GraphQLInt },
  },
  async resolve(parent, { id, name, surname, patronymic, id_cathedra }) {
    let res = await db.teacher.update(
      { name, surname, patronymic, id_cathedra },
      {
        where: {
          id,
        },
      }
    );
    return res[0]
      ? { successful: true, message: "Teacher was updated" }
      : { successful: false, message: "Teacher wasn`t updated" };
  },
};
