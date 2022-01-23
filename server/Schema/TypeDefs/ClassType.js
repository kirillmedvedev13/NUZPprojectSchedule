import {
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import Assigned_disciplineType from "./Assigned_disciplineType.js";
import Assigned_groupType from "./Assigned_groupType.js";
import Assigned_teacherType from "./Assigned_teacherType.js";
import Type_classType from "./Type_classType.js";
import { Recommended_audienceType } from "./Recommended_audienceType.js";

const ClassType = new GraphQLObjectType({
  name: "Class",
  fields: () => ({
    id: { type: GraphQLID },
    type_class: { type: Type_classType },
    times_per_week: { type: GraphQLFloat },
    assigned_discipline: { type: Assigned_disciplineType },
    assigned_groups: { type: new GraphQLList(Assigned_groupType) },
    assigned_teachers: { type: new GraphQLList(Assigned_teacherType) },
    recommended_audiences: { type: new GraphQLList(Recommended_audienceType) },
  }),
});

export default ClassType;
