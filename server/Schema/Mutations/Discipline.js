import { GraphQLID, GraphQLInt, GraphQLString } from "graphql";
import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";

export const CREATE_DISCIPLINE = {
  type: MessageType,
  args: {
    name: { type: GraphQLString },
    id_specialty: {type : GraphQLInt}
  },
  async resolve(parent, { name,id_specialty}) {
    let res = await db.discipline.create({
      name,
      id_specialty,
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
  async resolve(parent, { id,name, id_specialty }) {
    let res = await db.discipline.update(
      { name, number_students, id_specialty },
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
