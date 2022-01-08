import {
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import Assigned_disciplineType from "./Assigned_disciplineType.js";
import Type_classType from "./Type_classType.js";

const ClassType = new GraphQLObjectType({
  name: "Class",
  fields: () => ({
    id: { type: GraphQLID },
    type_class: { type: Type_classType },
    times_per_week: { type: GraphQLFloat },
    assigned_discipline: { type: Assigned_disciplineType },
  }),
});

export default ClassType;
