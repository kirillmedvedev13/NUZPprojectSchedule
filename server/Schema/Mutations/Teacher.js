import { GraphQLInt, GraphQLString } from "graphql";
import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";

export const CreateTeacher = {
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
      ? { successful: true, message: "Запис викладача успішно створено" }
      : { successful: false, message: "Помилка при створенні запису викладача" };
  },
};

export const DeleteTeacher = {
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
      ? { successful: true, message: "Запис викладача успішно видалено" }
      : { successful: false, message: "Помилка при видаленні запису викладача" };
  },
};

export const UpdateTeacher = {
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
      ? { successful: true, message: "Запис викладача усішно оновлено" }
      : { successful: false, message: "Помилка при оновленні запису викладача" };
  },
};
