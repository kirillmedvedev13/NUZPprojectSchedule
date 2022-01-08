import { GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { SpecialtyType } from "./SpecialtyType.js";


const GroupType = new GraphQLObjectType({
  name: "Group",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    number_students: { type: GraphQLInt },
    specialty: {type: SpecialtyType},
  }),
});

export default GroupType;