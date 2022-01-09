import { GraphQLID, GraphQLObjectType, GraphQLInt } from "graphql";
import ClassType from "./ClassType.js";
import TeacherType from "./TeacherType.js";

const Assigned_teacherType = new GraphQLObjectType({
  name: "Assigned_teacher",
  fields: () => ({
    id: { type: GraphQLID },
    class: { type: ClassType },
    teacher: { type: TeacherType },
  }),
});

export default Assigned_teacherType;
