import { GraphQLID, GraphQLObjectType, GraphQLList } from "graphql";
import ClassType from "./ClassType.js";
import GroupType from "./GroupType.js";

export default new GraphQLObjectType({
  name: "Assigned_group",
  fields: () => ({
    id: { type: GraphQLID },
    class: { type: ClassType },
    group: { type: GroupType },
  }),
});

