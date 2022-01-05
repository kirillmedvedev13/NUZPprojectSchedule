import { TeacherType } from "../TypeDefs/Teacher.js";
import { GraphQLID, GraphQLString } from "graphql";
import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";

export const CREATE_TEACHER = {
  type: TeacherType,
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
    });
    return { name, surname, patronymic };
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
        return { successful: false, message: "Teacher was not deleted!" };
      });
    return { successful: true, message: "Teacher was deleted!" };
  },
};

export const UPDATE_TEACHER = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
    surname: { type: GraphQLString },
  },
  async resolve(parent, { id, surname }) {
    await db.teachers.update(
      { surname },
      {
        where: {
          id,
        },
      }
    );
    return { successful: true, message: "Teacher was updated!" };
  },
};
