import { GraphQLID, GraphQLObjectType, GraphQLInt } from "graphql";
import ClassType from "./ClassType.js";
import GroupType from "./GroupType.js";

const Assigned_groupType = new GraphQLObjectType({
  name: "Assigned_group",
  fields: () => ({
    id: { type: GraphQLID },
    class: { type: ClassType },
    group: { type: GroupType },
  }),
});

export default Assigned_groupType;
