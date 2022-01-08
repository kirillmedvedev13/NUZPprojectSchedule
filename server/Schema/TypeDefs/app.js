import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { GET_ALL_TEACHERS } from "../Queries/Teacher.js";
import { CREATE_TEACHER,DELETE_TEACHER,UPDATE_TEACHER,} from "../Mutations/Teacher.js";
import { GET_ALL_AUDIENCES } from "../Queries/Audience.js";
import {CREATE_AUDIENCE,DELETE_AUDIENCE,UPDATE_AUDIENCE,} from "../Mutations/Audience.js";
import { GET_ALL_CATHEDRAS } from "../Queries/Cathedra.js";
import {CREATE_CATHEDRA,DELETE_CATHEDRA,UPDATE_CATHEDRA,} from "../Mutations/Cathedra.js";
import { GET_ALL_SPECIALTY } from "../Queries/Specialty.js";
import { CREATE_SPECIALTY, DELETE_SPECIALTY, UPDATE_SPECIALTY } from "../Mutations/Specialty.js";
import { GET_WEEKS_DAY } from "../Queries/Day_week.js";
import {GET_ALL_ASSIGNED_AUDIENCES} from "../Queries/Assigned_audience.js"
import {CREATE_ASSIGNED_AUDIENCE, DELETE_ASSIGNED_AUDIENCE} from "../Mutations/Assigned_audience.js"
import { GET_ALL_TYPE_CLASSES } from "../Queries/Type_class.js";
import { GET_ALL_GROUPS } from "../Queries/Group.js";
import { CREATE_GROUP, UPDATE_GROUP, DELETE_GROUP } from "../Mutations/Group.js";
import { GET_ALL_DISCIPLINES } from "../Queries/Discipline.js";
import { CREATE_DISCIPLINE, UPDATE_DISCIPLINE, DELETE_DISCIPLINE, ADD_DISCIPLINE_TO_SPECIALTY } from "../Mutations/Discipline.js";

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    GetAllTeachers: GET_ALL_TEACHERS,
    GetAllAudiences: GET_ALL_AUDIENCES,
    GetAllCathedras: GET_ALL_CATHEDRAS,
    GetAllSpecialties: GET_ALL_SPECIALTY,
    GetWeeksDay: GET_WEEKS_DAY,
    GetAllAssignedAudiences: GET_ALL_ASSIGNED_AUDIENCES,
    GetAllTypeClasses: GET_ALL_TYPE_CLASSES,
    GetAllGroups: GET_ALL_GROUPS,
    GetAllDisciplines: GET_ALL_DISCIPLINES,
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
    DeleteAssignedAudience: DELETE_ASSIGNED_AUDIENCE,
    CreateGroup: CREATE_GROUP, 
    UpdateGroup: UPDATE_GROUP, 
    DeleteGroup: DELETE_GROUP,
    DeleteSpecialty: DELETE_SPECIALTY, 
    UpdateSpecialty: UPDATE_SPECIALTY,
    CreateDiscipline: CREATE_DISCIPLINE, 
    UpdateDiscipline: UPDATE_DISCIPLINE, 
    DeleteDiscipline: DELETE_DISCIPLINE,
    AddDisciplineToSpecialty: ADD_DISCIPLINE_TO_SPECIALTY,
  },
});

const Schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
export default Schema;
