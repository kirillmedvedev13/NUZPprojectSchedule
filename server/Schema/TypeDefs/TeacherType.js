import {
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
} from "graphql";
import Assigned_teacherType from "./Assigned_teacherType.js";

const TeacherType = new GraphQLObjectType({
  name: "Teacher",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    surname: { type: GraphQLString },
    patronymic: { type: GraphQLString },
    assigned_teachers: { type: new GraphQLList(Assigned_teacherType) },
  }),
});

export default TeacherType;
