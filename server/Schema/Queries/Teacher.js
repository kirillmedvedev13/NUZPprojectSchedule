import { GraphQLList } from "graphql";
import db from "../../database.js";
import { TeacherType } from "../TypeDefs/Teacher.js";

const GET_ALL_TEACHERS = {
  type: new GraphQLList(TeacherType),
  resolve() {
    return db.teachers.find();
  },
};
export default GET_ALL_TEACHERS;
