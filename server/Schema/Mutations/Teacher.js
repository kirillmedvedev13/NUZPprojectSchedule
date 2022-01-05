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
    await db.teachers.create({
      name,
      surname,
      patronymic,
    })
    .catch((err) => {
      return { successful: false, message: "Teacher wasn`t deleted!\n" + err }
    });
    return {successful: true, message: "Teacher was created" };
  },
};

export const DELETE_TEACHER = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, { id }) {
    await db.teachers
      .destroy({
        where: {
          id,
        },
      })
      .catch((err) => {
        return { successful: false, message: "Teacher wasn`t deleted!\n" + err }
      });
      return {successful: true, message: "Teacher was deleted" };
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
    await db.teachers.update(
      { name, surname, patronymic },
      {
        where: {
          id
        },
      }
    ).then((res) => {
      console.log(res);
      return {successful: true, message: "Teacher was updated" + res };
    })
    .catch((err) => {
      console.log(err);
      return { successful: false, message: "Teacher wasn`t updated!\n" + err }
    });
  },
};
