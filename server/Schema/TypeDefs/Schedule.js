import { GraphQLID, GraphQLInt, GraphQLObjectType, } from "graphql";
import Day_weekType from "./Day_weekType.js"
import Pair_typeType from "./Pair_typeType.js"
import ClassType from "./ClassType.js"
import GroupType  from "./GroupType.js";
import AudienceType from "./AudienceType.js"

export const ScheduleType = new GraphQLObjectType({
  name: "Schedule",
  fields: () => ({
    id: { type: GraphQLID },
    number_pair: { type: GraphQLInt },
    day_week: { type: Day_weekType },
    pair_type: {type: Pair_typeType},
    class: {type: ClassType},
    group: {type: GroupType},
    audience: {type: AudienceType},
  }),
});
