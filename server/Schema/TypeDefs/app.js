import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { GET_ALL_TEACHERS } from "../Queries/Teacher.js";
import {
  CREATE_TEACHER,
  DELETE_TEACHER,
  UPDATE_TEACHER,
} from "../Mutations/Teacher.js";
import { GET_ALL_AUDIENCES } from "../Queries/Audience.js";
import {
  CREATE_AUDIENCE,
  DELETE_AUDIENCE,
  UPDATE_AUDIENCE,
} from "../Mutations/Audience.js";
import { GET_ALL_CATHEDRAS } from "../Queries/Cathedra.js";
import {
  CREATE_CATHEDRA,
  DELETE_CATHEDRA,
  UPDATE_CATHEDRA,
} from "../Mutations/Cathedra.js";
import { GET_ALL_SPECIALTY } from "../Queries/Specialty.js";
import { CREATE_SPECIALTY } from "../Mutations/Specialty.js";
import {GET_ALL_ASSIGNED_AUDIENCES} from "../Queries/Assigned_audience.js"
import {CREATE_ASSIGNED_AUDIENCE, DELETE_ASSIGNED_AUDIENCE} from "../Mutations/Assigned_audience.js"
const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    GetAllTeachers: GET_ALL_TEACHERS,
    GetAllAudiences: GET_ALL_AUDIENCES,
    GetAllCathedras: GET_ALL_CATHEDRAS,
    GetAllSpecialties: GET_ALL_SPECIALTY,
    GetAllAssignedAudiences: GET_ALL_ASSIGNED_AUDIENCES
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    CreateTeacher: CREATE_TEACHER,
    DeleteTeacher: DELETE_TEACHER,
    UpdateTeacher: UPDATE_TEACHER,
    CreateAudience: CREATE_AUDIENCE,
    DeleteAudience: DELETE_AUDIENCE,
    UpdateAudience: UPDATE_AUDIENCE,
    CreateCathedra: CREATE_CATHEDRA,
    DeleteCathedra: DELETE_CATHEDRA,
    UpdateCathedra: UPDATE_CATHEDRA,
    CreateSpecialty: CREATE_SPECIALTY,
    CreateAssignedAudience: CREATE_ASSIGNED_AUDIENCE,
    DeleteAssignedAudience: DELETE_ASSIGNED_AUDIENCE
  },
});

const Schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
export default Schema;
