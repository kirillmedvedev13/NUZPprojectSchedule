import {
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
} from "graphql";
import AudienceType from "./AudienceType.js";
import ClassType from "./ClassType.js";

export default new GraphQLObjectType({
  name: "Schedule",
  fields: () => ({
    id: { type: GraphQLID },
    number_pair: { type: GraphQLInt },
    day_week: { type: GraphQLInt },
    pair_type: { type: GraphQLInt },
    audience: { type: AudienceType },
    class: { type: ClassType },
  }),
});
