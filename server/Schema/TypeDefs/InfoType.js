import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";

export default new GraphQLObjectType({
  name: "Info",
  fields: () => ({
    max_day: { type: GraphQLInt },
    max_pair: { type: GraphQLInt },
    max_semester: { type: GraphQLString },
    fitness_value: { type: GraphQLString },
    general_values: { type: GraphQLString },
  }),
});
