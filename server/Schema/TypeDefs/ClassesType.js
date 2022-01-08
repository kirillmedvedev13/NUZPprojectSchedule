import {
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

const ClassesType = new GraphQLObjectType({
  name: "Classes",
  fields: () => ({
    id: { type: GraphQLID },
    type: { type: GraphQLString },
    times_per_week: { type: GraphQLFloat },
    id_discipline: { type: GraphQLInt },
  }),
});

export default ClassesType;
