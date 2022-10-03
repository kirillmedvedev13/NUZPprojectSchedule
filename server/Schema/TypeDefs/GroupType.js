import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import Assigned_groupType from "./Assigned_groupType.js";
import SpecialtyType from "./SpecialtyType.js";

export default new GraphQLObjectType({
  name: "Group",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    number_students: { type: GraphQLInt },
    specialty: { type: SpecialtyType },
    semester: { type: GraphQLInt },
    assigned_groups: { type: new GraphQLList(Assigned_groupType) },
  }),
});

