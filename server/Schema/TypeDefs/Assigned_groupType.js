import { GraphQLID, GraphQLObjectType, GraphQLList } from "graphql";
import ClassType from "./ClassType.js";
import GroupType from "./GroupType.js";
import { ScheduleType } from "./Schedule.js";

const Assigned_groupType = new GraphQLObjectType({
  name: "Assigned_group",
  fields: () => ({
    id: { type: GraphQLID },
    class: { type: ClassType },
    group: { type: GroupType },
    schedules: { type: new GraphQLList(ScheduleType) },
  }),
});

export default Assigned_groupType;
