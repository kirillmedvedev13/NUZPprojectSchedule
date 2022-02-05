import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

const CathedraType = new GraphQLObjectType({
  name: "Cathedra",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    short_name: { type: GraphQLString },
  }),
});

export default CathedraType;
