import { GraphQLInt, GraphQLObjectType, GraphQLFloat, GraphQLString } from "graphql";

const InfoType = new GraphQLObjectType({
  name: "Info",
  fields: () => ({
    max_day: { type: GraphQLInt },
    max_pair: { type: GraphQLInt },
    population_size: {
      type: GraphQLInt,
    },
    max_generations: {
      type: GraphQLInt,
    },
    fitness_value: {
      type: GraphQLString
    },
    p_crossover: {
      type: GraphQLFloat,
    },
    p_mutation: {
      type: GraphQLFloat,
    },
    p_genes: {
      type: GraphQLFloat,
    },
    penaltyGrWin: {
      type: GraphQLFloat,
    },
    penaltyTeachWin: {
      type: GraphQLFloat,
    },
    penaltyLateSc: {
      type: GraphQLFloat,
    },
    penaltyEqSc: {
      type: GraphQLFloat,
    },
    penaltySameTimesSc: {
      type: GraphQLFloat,
    },
    p_elitism: {
      type: GraphQLFloat,
    },
  }),
});

export default InfoType;
