import { GraphQLList } from "graphql";
import db from "../../database.js";
import { TeacherType } from "../TypeDefs/Teacher.js";

export const GET_ALL_TEACHERS = {
  type: new GraphQLList(TeacherType),
  resolve() {
    return db.teachers.findAll();
  },
};
