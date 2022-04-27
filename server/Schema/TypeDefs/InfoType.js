import {
    GraphQLInt,
    GraphQLObjectType,
  } from "graphql";
  
  const InfoType = new GraphQLObjectType({
    name: "Info",
    fields: () => ({
      max_day: { type: GraphQLInt },
      max_pair: { type: GraphQLInt },
    }),
  });
  
  export default InfoType;
  