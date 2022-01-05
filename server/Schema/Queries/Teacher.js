import { GraphQLList } from "graphql";
import db from "../../database.js";
import TeacherType from "../TypeDefs/TeacherType.js";

export const GET_ALL_TEACHERS = {
  type: new GraphQLList(TeacherType),
  resolve() {
    return db.teachers.findAll();
  },
};
