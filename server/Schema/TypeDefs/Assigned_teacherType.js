import { GraphQLID, GraphQLObjectType, GraphQLInt } from "graphql";
import { ClassType } from "./ClassType.js";
import { TeacherType } from "./TeacherType.js";

const Assigned_disciplineType = new GraphQLObjectType({
  name: "Assigned_discipline",
  fields: () => ({
    id: { type: GraphQLID },
    class: { type: ClassType },
    teacher: { type: TeacherType },
  }),
});

export default Assigned_disciplineType;
