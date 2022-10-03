import {
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList,
} from "graphql";
import Type_classType from "./Type_classType.js";
import Assigned_audienceType from "./Assigned_audienceType.js";
import ScheduleType from "./ScheduleType.js";

export default new GraphQLObjectType({
  name: "Audience",
  fields: () => ({
    id: { type: GraphQLID },
    type_class: { type: Type_classType },
    name: { type: GraphQLString },
    capacity: { type: GraphQLInt },
    assigned_audiences: { type: new GraphQLList(Assigned_audienceType) },
    schedules: { type: new GraphQLList(ScheduleType) },
  }),
});

