import { GraphQLID, GraphQLString } from "graphql";
import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";

export const CREATE_TEACHER = {
  type: MessageType,
  args: {
    name: { type: GraphQLString },
    surname: { type: GraphQLString },
    patronymic: { type: GraphQLString },
  },
  async resolve(parent, { name, surname, patronymic }) {
    let res = await db.teachers.create({
      name,
      surname,
      patronymic,
    });
    return res ? {successful: true, message: "Teacher was created"} : {successful: false, message: "Teacher wasn`t created"};
  },
};

export const DELETE_TEACHER = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, { id }) {
    let res = await db.teachers
      .destroy({
        where: {
          id,
        },
      });
      return res ? {successful: true, message: "Teacher was deleted"} : {successful: false, message: "Teacher wasn`t deleted"};
    },
  };

export const UPDATE_TEACHER = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    surname: { type: GraphQLString },
    patronymic: { type: GraphQLString },
  },
  async resolve(parent, { id, name, surname, patronymic }) {
    let res = await db.teachers.update(
      { name, surname, patronymic },
      {
        where: {
          id
        },
      }
    );
    return res[0] ? {successful: true, message: "Teacher was updated"} : {successful: false, message: "Teacher wasn`t updated"};
  },
};
