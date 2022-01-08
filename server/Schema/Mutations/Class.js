import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLString } from "graphql";
import MessageType from "../TypeDefs/MessageType.js";

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
    let classes = await db.discipline.findOne({
      where: {
        id: id_class,
      },
    });
    if (!disc) return { successful: false, message: "Cannot find discipline" };
    let res = await disc.addSpecialty(spec, { through: { semester } });
    return res
      ? { successful: true, message: "Discipline was added to Specialty" }
      : { successful: false, message: "Discipline wasn`t added to Specialty" };
  },
};
