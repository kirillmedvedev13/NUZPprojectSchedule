import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLString } from "graphql";
import MessageType from "../TypeDefs/MessageType.js";
import db from "../../database.js";

export const CREATE_CLASS = {
  type: MessageType,
  args: {
    id_type_class: { type: GraphQLInt },
    times_per_week: { type: GraphQLInt },
    id_assigned_discipline: { type: GraphQLInt },
    assigned_teachers: { type: GraphQLString },
    assigned_groups: { type: GraphQLString },
    recommended_audiences: { type: GraphQLString },
  },
  async resolve(
    parent,
    { id_type_class, times_per_week, id_assigned_discipline, assigned_teachers, assigned_groups, recommended_audiences }
  ) {
    let res = await db.class.create({
      id_type_class,
      times_per_week,
      id_assigned_discipline,
    });
    if (res) {
      if (assigned_teachers) {
        const atIDs = JSON.parse(assigned_teachers);
        await db.assigned_teacher.bulkCreate(atIDs.map(item => { return { id_class: res.dataValues.id, id_teacher: item } }))
      }
      if (assigned_groups) {
        const agIDs = JSON.parse(assigned_groups);
        await db.assigned_group.bulkCreate(agIDs.map(item => { return { id_class: res.dataValues.id, id_group: item } }))
      }
      if (recommended_audiences) {
        const raIDs = JSON.parse(recommended_audiences);
        await db.recommended_audience.bulkCreate(raIDs.map(item => { return { id_class: res.dataValues.id, id_audience: item } }))
      }
    }
    return res
      ? { successful: true, message: "Class was created" }
      : { successful: false, message: "Class wasn`t created" };
  },
};

export const UPDATE_CLASS = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
    id_type_class: { type: GraphQLInt },
    times_per_week: { type: GraphQLInt },
    id_assigned_discipline: { type: GraphQLInt },
  },
  async resolve(parent, { id, id_type_class, times_per_week, id_assigned_discipline }) {
    let res = await db.class.update(
      { id_type_class, times_per_week, id_assigned_discipline },
      {
        where: {
          id,
        },
      }
    );
    return res[0]
      ? { successful: true, message: "Class was updated" }
      : { successful: false, message: "Class wasn`t updated" };
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
export const ADD_RECOMMENDED_AUDIENCE_TO_CLASS = {
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

export const ADD_GROUP_TO_CLASS = {
  type: MessageType,
  args: {
    id_group: { type: GraphQLID },
    id_class: { type: GraphQLID },
  },
  async resolve(parent, { id_group, id_class }) {
    let group = await db.group.findOne({
      where: {
        id: id_group,
      },
    });
    if (!group)
      return { successful: false, message: "Cannot find group" };
    let classes = await db.class.findOne({
      where: {
        id: id_class,
      },
    });
    if (!classes) return { successful: false, message: "Cannot find class" };
    let res = await classes.addGroup(group);
    return res
      ? { successful: true, message: "Group was added to Class" }
      : { successful: false, message: "Group wasn`t added to Class" };
  },
};

export const DELETE_TEACHER_FROM_CLASS = {
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
      ? { successful: true, message: "Teacher was deleted from Class" }
      : { successful: false, message: "Teacher wasn`t deleted from Class" };
  },
};
export const DELETE_RECOMMENDED_AUDIENCE_FROM_CLASS = {
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
      ? { successful: true, message: "Recommended audience was deleted from Class" }
      : { successful: false, message: "Recommended audience wasn`t deleted from Class" };
  },
};
export const DELETE_GROUP_FROM_CLASS = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, { id }) {
    let res = await db.assigned_group.destroy({
      where: {
        id,
      },
    });
    return res
      ? { successful: true, message: "Group was deleted from Class" }
      : { successful: false, message: "Group wasn`t deleted from Class" };
  },
};
