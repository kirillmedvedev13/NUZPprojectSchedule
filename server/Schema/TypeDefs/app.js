import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { GET_ALL_TEACHERS } from "../Queries/Teacher.js";
import {
  CREATE_TEACHER,
  DELETE_TEACHER,
  UPDATE_TEACHER,
} from "../Mutations/Teacher.js";

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    GetAllTeachers: GET_ALL_TEACHERS,
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    CreateTeacher: CREATE_TEACHER,
    DeleteTeacher: DELETE_TEACHER,
    UpdateTeacher: UPDATE_TEACHER,
  },
});

const Schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
export default Schema;
