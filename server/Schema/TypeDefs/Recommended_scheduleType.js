import { GraphQLID, GraphQLObjectType, GraphQLInt } from "graphql";
import ClassType from "./ClassType.js";

export default new GraphQLObjectType({
  name: "Recommended_schedule",
  fields: () => ({
    id: { type: GraphQLID },
    number_pair: { type: GraphQLInt },
    day_week: { type: GraphQLInt },
    class: { type: ClassType },
  }),
});
