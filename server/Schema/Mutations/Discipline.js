import { GraphQLID, GraphQLInt, GraphQLString, GraphQLList } from "graphql";
import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";

export const CREATE_DISCIPLINE = {
  type: MessageType,
  args: {
    name: { type: GraphQLString },
    assigned_disciplines: { type: GraphQLString },
  },
  async resolve(parent, { name, assigned_disciplines }) {
    const res1 = await db.discipline.create({
      name,
    });
    let arraySpec = JSON.parse(assigned_disciplines);
    const discID = res1.dataValues.id;
    let arrAssignDisc = arraySpec.map((object) => {
      return {
        id_discipline: discID,
        id_specialty: object.specialty.id,
        semester: object.semester,
      };
    });
    const res2 = await db.assigned_discipline.bulkCreate(arrAssignDisc);
    return res2
      ? {
          successful: true,
          message:
            "Запис дисципліни успішно створено і додані зв'язки",
        }
      : { successful: false, message: "Помилка при створені запису дисципліни" };
  },
};

export const DELETE_DISCIPLINE = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, { id }) {
    let res = await db.discipline.destroy({
      where: {
        id,
      },
    });
    return res
      ? { successful: true, message: "Запис дисципліни успішо видалено" }
      : { successful: false, message: "Помилка при видаленні запису дисципліни" };
  },
};

export const UPDATE_DISCIPLINE = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  },
  async resolve(parent, { id, name }) {
    let res = await db.discipline.update(
      { name },
      {
        where: {
          id,
        },
      }
    );

    return res
      ? { successful: true, message: "Запис дисципліни успішно оновлено" }
      : { successful: false, message: "Помилка при оновленні запису дисципліни" };
  },
};

export const ADD_DISCIPLINE_TO_SPECIALTY = {
  type: MessageType,
  args: {
    id_discipline: { type: GraphQLInt },
    id_specialty: { type: GraphQLInt },
    semester: { type: GraphQLInt },
  },
  async resolve(parent, { id_discipline, id_specialty, semester }) {
    let spec = await db.specialty.findOne({
      where: {
        id: id_specialty,
      },
    });
    if (!spec) return { successful: false, message: "Не знайдено спеціальність" };
    let disc = await db.discipline.findOne({
      where: {
        id: id_discipline,
      },
    });
    if (!disc) return { successful: false, message: "Не знайдено дисципліну" };
    let res = await db.assigned_discipline.create({
      id_discipline,
      id_specialty,
      semester,
    });
    console.log(res);
    return res
      ? { successful: true, message: "Дисципліна успішно додана до спеціальності" }
      : { successful: false, message: "Помилка при додаванні дисципліни до спеціальності" };
  },
};

export const DELETE_DISCIPLINE_FROM_SPECIALTY = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, { id }) {
    let res = await db.assigned_discipline.destroy({
      where: {
        id,
      },
    });
    return res
      ? { successful: true, message: "Дисципліну успішно видалено від спеціальності" }
      : {
          successful: false,
          message: "Помилка при видаленні дисципліни від спеціальності",
        };
  },
};
