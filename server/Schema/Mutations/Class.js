import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLString } from "graphql";
import MessageType from "../TypeDefs/MessageType.js";
import db from "../../database.js";

export const CREATE_CLASS = {
  type: MessageType,
  args: {
    id_type_class: { type: GraphQLString },
    times_per_week: { type: GraphQLFloat },
    id_assigned_discipline: { type: GraphQLInt },
  },
  async resolve(
    parent,
    { id_type_class, times_per_week, id_assigned_discipline }
  ) {
    let res = await db.classes.create({
      id_type_class,
      times_per_week,
      id_assigned_discipline,
    });
    return res
      ? { successful: true, message: "Class was created" }
      : { successful: false, message: "Class wasn`t created" };
  },
};
export const ADD_TEACHER_TO_CLASS = {
  type: MessageType,
  args: {
    id_teacher: { type: GraphQLID },
    id_class: { type: GraphQLID },
  },
  async resolve(parent, { id_teacher, id_class }) {
    let teach = await db.teacher.findOne({
      where: {
        id: id_teacher,
      },
    });
    if (!teach) return { successful: false, message: "Cannot find teacher" };
    let classes = await db.class.findOne({
      where: {
        id: id_class,
      },
    });
    if (!classes) return { successful: false, message: "Cannot find class" };
    let res = await classes.addTeacher(teach);
    return res
      ? { successful: true, message: "Teacher was added to Class" }
      : { successful: false, message: "Teacher wasn`t added to Class" };
  },
};
export const ADD_REC_AUD_TO_CLASS = {
  type: MessageType,
  args: {
    id_audience: { type: GraphQLID },
    id_class: { type: GraphQLID },
  },
  async resolve(parent, { id_audience, id_class }) {
    let audience = await db.audience.findOne({
      where: {
        id: id_audience,
      },
    });
    if (!audience)
      return { successful: false, message: "Cannot find audience" };
    let classes = await db.class.findOne({
      where: {
        id: id_class,
      },
    });
    if (!classes) return { successful: false, message: "Cannot find class" };
    let res = await classes.addAudience(audience);
    return res
      ? { successful: true, message: "Audience was added to Class" }
      : { successful: false, message: "Audience wasn`t added to Class" };
  },
};
export const DELETE_CLASS = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, { id }) {
    let res = await db.class.destroy({
      where: {
        id,
      },
    });
    return res
      ? { successful: true, message: "Class was deleted" }
      : { successful: false, message: "Class wasn`t deleted" };
  },
};

export const DELETE_CLASS_FROM_TEACHER = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, { id }) {
    let res = await db.assigned_teacher.destroy({
      where: {
        id,
      },
    });
    return res
      ? { successful: true, message: "Class was deleted from Teacher" }
      : { successful: false, message: "Class wasn`t deleted from Teacher" };
  },
};
export const DELETE_CLASS_FROM_AUDIENCE = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, { id }) {
    let res = await db.recommended_audience.destroy({
      where: {
        id,
      },
    });
    return res
      ? { successful: true, message: "Class was deleted from Teacher" }
      : { successful: false, message: "Class wasn`t deleted from Teacher" };
  },
};
