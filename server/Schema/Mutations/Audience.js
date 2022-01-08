import { GraphQLID, GraphQLInt, GraphQLString } from "graphql";
import db from "../../database.js";
import MessageType from "../TypeDefs/MessageType.js";

export const CREATE_AUDIENCE = {
  type: MessageType,
  args: {
    audience_number: { type: GraphQLString },
    type: { type: GraphQLString },
    capacity: { type: GraphQLInt },
  },
  async resolve(parent, { audience_number, type, capacity }) {
    let res = await db.audience.create({
      audience_number,
      type,
      capacity,
    });
    return res
      ? { successful: true, message: "Audience was created" }
      : { successful: false, message: "Audience wasn`t created" };
  },
};

export const UPDATE_AUDIENCE = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
    audience_number: { type: GraphQLString },
    type: { type: GraphQLString },
    capacity: { type: GraphQLInt },
  },
  async resolve(parent, { id, audience_number, type, capacity }) {
    let res = await db.audience.update(
      { audience_number, type, capacity },
      {
        where: {
          id,
        },
      }
    );
    return res[0]
      ? { successful: true, message: "Audience was updated" }
      : { successful: false, message: "Audience wasn`t updated" };
  },
};

export const ADD_AUDIENCE_TO_CATHEDRA = {
  type: MessageType,
  args: {
    id_audience: { type: GraphQLID },
    id_cathedra: {type : GraphQLID}
  },
  async resolve(parent, { id_audience,id_cathedra }) {
    let aud = await db.audience.findOne(
      {
        where: {
          id: id_audience
        },
      }
    );
    if(!aud) return { successful: false, message: "Cannot find audience" };
    let cath = await db.cathedra.findOne(
      {
        where: {
          id: id_cathedra
        },
      }
    );
    if(!cath) return { successful: false, message: "Cannot find cathedra" };
    console.log(aud);
    let res = await aud.addCathedra(cath);
    return res
      ? { successful: true, message: "Audience was added to Cathedra" }
      : { successful: false, message: "Audience wasn`t added to Cathedra" };
  },
};

export const DELETE_AUDIENCE_FROM_CATHEDRA = {
  type: MessageType,
  args: {
    id: { type: GraphQLID},
  },
  async resolve(parent, {id}){
    let res = await db.assigned_audience.destroy({
      where: {
        id
      }
    });
    return res
    ? { successful: true, message: "Audience was deleted from Cathedra" }
    : { successful: false, message: "Audience wasn`t deleted from Cathedra" };
  }
};
git