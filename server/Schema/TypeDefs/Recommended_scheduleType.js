import {
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
  } from "graphql";
  import ClassType from "./ClassType.js";
  
  export const Recommended_audienceType = new GraphQLObjectType({
    name: "Recommended_audience",
    fields: () => ({
      id: { type: GraphQLID },
      number_pair:{ type: GraphQLInt},
      day_week:{ type: GraphQLInt},
      class: { type: ClassType },
    }),
  });
  