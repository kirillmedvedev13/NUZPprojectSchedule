import { GraphQLID, GraphQLInt, GraphQLString } from "graphql";
import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";

export const CreateGroup = {
  type: MessageType,
  args: {
    name: { type: GraphQLString },
    number_students: { type: GraphQLInt },
    id_specialty: { type: GraphQLInt },
    semester: { type: GraphQLInt }
  },
  async resolve(parent, { name, number_students, id_specialty, semester }) {
    let res = await db.group.create({
      name,
      number_students,
      id_specialty,
      semester,
    });
    return res
      ? { successful: true, message: "Запис групи успішно створено" }
      : { successful: false, message: "Помилка при створенні запису групи" };
  },
};

export const DeleteGroup = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, { id }) {
    let res = await db.group.destroy({
      where: {
        id,
      },
    });
    return res
      ? { successful: true, message: "Запис групи успішно видалено" }
      : { successful: false, message: "Помилка при видаленні запису групи" };
  },
};

export const UpdateGroup = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
    number_students: { type: GraphQLInt },
    name: { type: GraphQLString },
    id_specialty: { type: GraphQLInt },
    semester: { type: GraphQLInt }
  },
  async resolve(parent, { id, name, number_students, id_specialty, semester }) {
    let res = await db.group.update(
      { name, number_students, id_specialty, semester },
      {
        where: {
          id,
        },
      }
    );
    return res[0]
      ? { successful: true, message: "Запис групи успішно оновлено" }
      : { successful: false, message: "Помилка при оновленні запису групи" };
  },
};
