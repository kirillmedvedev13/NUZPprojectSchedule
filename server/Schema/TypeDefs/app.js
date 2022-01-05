import { GraphQLObjectType, GraphQLSchema } from "graphql";
import GET_ALL_TEACHERS from "../Queries/Teacher.js";

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    GetAllTeachers: GET_ALL_TEACHERS,
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {},
});

const Schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
export default Schema;
