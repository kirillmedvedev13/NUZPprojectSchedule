import { GraphQLID, GraphQLInt, GraphQLString } from "graphql";
import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";

export const CREATE_AUDIENCE = {
  type: MessageType,
  args: {
    name: { type: GraphQLString },
    capacity: { type: GraphQLInt },
    id_type_class: { type: GraphQLInt },
    assigned_cathedras: { type: GraphQLString },
  },
  async resolve(parent, { name, capacity, id_type_class, assigned_cathedras }) {
    let res = await db.audience.create({
      name,
      capacity,
      id_type_class
    });
    if (res && assigned_cathedras) {
      assigned_cathedras = JSON.parse(assigned_cathedras);
      let arrAssigned_cathedras = assigned_cathedras.map((object) => {
        return {
          id_audience: res.dataValues.id,
          id_cathedra: object.cathedra.id,
        };
      });
      await db.assigned_audience.bulkCreate(arrAssigned_cathedras)
    }
    return res
      ? { successful: true, message: "Запис аудиторії успішно створено" }
      : { successful: false, message: "Помилка при створенні запису аудиторії" };
  },
};

export const UPDATE_AUDIENCE = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    capacity: { type: GraphQLInt },
    id_type_class: { type: GraphQLInt }
  },
  async resolve(parent, { id, name, capacity, id_type_class }) {
    let res = await db.audience.update(
      { name, capacity, id_type_class },
      {
        where: {
          id,
        },
      }
    );
    return res[0]
      ? { successful: true, message: "Запис аудиторії успішно оновлено" }
      : { successful: false, message: "Помилка при оновленні запису аудиторії" };
  },
};

export const DELETE_AUDIENCE = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, { id }) {
    let res = await db.audience.destroy({
      where: {
        id,
      },
    });
    return res
      ? { successful: true, message: "Запис аудиторії успішно видалено" }
      : { successful: false, message: "Помилка при видаленні запису аудиторії" };
  },
};

export const ADD_AUDIENCE_TO_CATHEDRA = {
  type: MessageType,
  args: {
    id_audience: { type: GraphQLID },
    id_cathedra: { type: GraphQLID },
  },
  async resolve(parent, { id_audience, id_cathedra }) {
    let aud = await db.audience.findOne({
      where: {
        id: id_audience,
      },
    });
    if (!aud) return { successful: false, message: "Не знайдено аудиторії" };
    let cath = await db.cathedra.findOne({
      where: {
        id: id_cathedra,
      },
    });
    if (!cath) return { successful: false, message: "Не знайдено кафедри" };
    let res = await aud.addCathedra(cath);
    return res
      ? { successful: true, message: "Аудиторія успішно додана до кафедри" }
      : { successful: false, message: "Помилка при додаванні аудиторії до кафедри" };
  },
};

export const DELETE_AUDIENCE_FROM_CATHEDRA = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, { id }) {
    let res = await db.assigned_audience.destroy({
      where: {
        id,
      },
    });
    return res
      ? { successful: true, message: "Аудиторія успішно видалена від кафедри" }
      : { successful: false, message: "Помилка при видаленні аудиторії від кафедри" };
  },
};

