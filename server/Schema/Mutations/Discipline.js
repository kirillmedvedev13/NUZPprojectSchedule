import { GraphQLID, GraphQLInt, GraphQLString } from "graphql";
import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";

export const CREATE_DISCIPLINE = {
  type: MessageType,
  args: {
    name: { type: GraphQLString },
  },
  async resolve(parent, { name}) {
    let res = await db.discipline.create({
      name,
    });
    return res
      ? { successful: true, message: "Discipline was created" }
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
    console.log(res);
    return res
      ? { successful: true, message: "Discipline was deleted" }
      : { successful: false, message: "Discipline wasn`t deleted" };
  },
};

export const UPDATE_DISCIPLINE = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
    id_specialty: {type : GraphQLInt}
  },
  async resolve(parent, { id,name }) {
    let res = await db.discipline.update(
      { name, },
      {
        where: {
          id,
        },
      }
    );
    return res[0]
      ? { successful: true, message: "Discipline was updated" }
      : { successful: false, message: "Discipline wasn`t updated" };
  },
};

export const ADD_DISCIPLINE_TO_SPECIALTY = {
  type: MessageType,
  args: {
    id_discipline: { type: GraphQLID },
    id_specialty: {type : GraphQLID}
  },
  async resolve(parent, { id_discipline,id_specialty }) {
    let spec = await db.specialty.findOne(
      {
        where: {
          id: id_specialty
        },
      }
    );
    if(!spec) return { successful: false, message: "Cannot find specialty" };
    let disc = await db.discipline.findOne(
      {
        where: {
          id: id_discipline
        },
      }
    );
    if(!disc) return { successful: false, message: "Cannot find discipline" };
    let res = await disc.addSpecialty(spec);
    console.log(res);
    return res
      ? { successful: true, message: "Discipline was added to Specialty" }
      : { successful: false, message: "Discipline wasn`t added to Specialty" };
  },
};