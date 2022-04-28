import {
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
} from "graphql";
import AudienceType from "./AudienceType.js";
import Assigned_groupType from "./Assigned_groupType.js";

export const ScheduleType = new GraphQLObjectType({
  name: "Schedule",
  fields: () => ({
    id: { type: GraphQLID },
    number_pair: { type: GraphQLInt },
    day_week: { type: GraphQLInt },
    pair_type: { type: GraphQLInt },
    assigned_group: { type: Assigned_groupType },
    audience: { type: AudienceType },
  }),
});
