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
            "Discipline was created and all specialties was added to discipline",
        }
      : { successful: false, message: "Discipline wasn`t created" };
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
      ? { successful: true, message: "Discipline was deleted" }
      : { successful: false, message: "Discipline wasn`t deleted" };
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
      ? { successful: true, message: "Discipline was updated" }
      : { successful: false, message: "Discipline wasn`t updated" };
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
    if (!spec) return { successful: false, message: "Cannot find specialty" };
    let disc = await db.discipline.findOne({
      where: {
        id: id_discipline,
      },
    });
    if (!disc) return { successful: false, message: "Cannot find discipline" };
    let res = await db.assigned_discipline.create({
      id_discipline,
      id_specialty,
      semester,
    });
    console.log(res);
    return res
      ? { successful: true, message: "Discipline was added to Specialty" }
      : { successful: false, message: "Discipline wasn`t added to Specialty" };
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
      ? { successful: true, message: "Discipline was deleted from Specialty" }
      : {
          successful: false,
          message: "Discipline wasn`t deleted from Specialty",
        };
  },
};
