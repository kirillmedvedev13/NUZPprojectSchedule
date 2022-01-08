import { GraphQLID, GraphQLInt, GraphQLString } from "graphql";
import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";

export const CREATE_GROUP = {
  type: MessageType,
  args: {
    name: { type: GraphQLString },
    number_students: { type: GraphQLInt },
    id_specialty: {type : GraphQLInt}
  },
  async resolve(parent, { name, number_students, id_specialty}) {
    let res = await db.group.create({
      name,
      number_students,
      id_specialty,
    });
    return res
      ? { successful: true, message: "Group was created" }
      : { successful: false, message: "Group wasn`t created" };
  },
};

export const DELETE_GROUP = {
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
    console.log(res);
    return res
      ? { successful: true, message: "Group was deleted" }
      : { successful: false, message: "Group wasn`t deleted" };
  },
};

export const UPDATE_GROUP = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    capacity: { type: GraphQLInt },
    id_type_class: {type : GraphQLInt}
  },
  async resolve(parent, { id,name,number_students, id_specialty }) {
    let res = await db.group.update(
      { name, number_students, id_specialty },
      {
        where: {
          id,
        },
      }
    );
    return res[0]
      ? { successful: true, message: "Group was updated" }
      : { successful: false, message: "Group wasn`t updated" };
  },
};
