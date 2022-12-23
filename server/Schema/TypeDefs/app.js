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
  ADD_CATHEDRA_TO_AUDIENCE,
  DELETE_CATHEDRA_FROM_AUDIENCE,
} from "../Mutations/Audience.js";
import { GET_ALL_CATHEDRAS } from "../Queries/Cathedra.js";
import {
  CREATE_CATHEDRA,
  DELETE_CATHEDRA,
  UPDATE_CATHEDRA,
} from "../Mutations/Cathedra.js";
import { GET_ALL_SPECIALTY } from "../Queries/Specialty.js";
import {
  CREATE_SPECIALTY,
  DELETE_SPECIALTY,
  UPDATE_SPECIALTY,
} from "../Mutations/Specialty.js";
import { GET_ALL_TYPE_CLASSES } from "../Queries/Type_class.js";
import { GET_ALL_GROUPS } from "../Queries/Group.js";
import {
  CREATE_GROUP,
  UPDATE_GROUP,
  DELETE_GROUP,
} from "../Mutations/Group.js";
import { GET_ALL_DISCIPLINES } from "../Queries/Discipline.js";
import {
  CREATE_DISCIPLINE,
  UPDATE_DISCIPLINE,
  DELETE_DISCIPLINE,
  ADD_DISCIPLINE_TO_SPECIALTY,
  DELETE_DISCIPLINE_FROM_SPECIALTY,
} from "../Mutations/Discipline.js";
import { GET_ALL_CLASSES } from "../Queries/Class.js";
import {
  GET_ALL_SCHEDULE_GROUPS,
  GET_ALL_SCHEDULE_AUDIENCES,
  GET_ALL_SCHEDULE_TEACHERS,
} from "../Queries/Schedule.js";
import {
  CREATE_CLASS,
  UPDATE_CLASS,
  DELETE_CLASS,
  ADD_GROUP_TO_CLASS,
  DELETE_GROUP_FROM_CLASS,
  ADD_RECOMMENDED_AUDIENCE_TO_CLASS,
  ADD_RECOMMENDED_SCHEDULE_TO_CLASS,
  DELETE_RECOMMENDED_AUDIENCE_FROM_CLASS,
  DELETE_RECOMMENDED_SCHEDULE_FROM_CLASS,
  ADD_TEACHER_TO_CLASS,
  DELETE_TEACHER_FROM_CLASS,
} from "../Mutations/Class.js";
import { LOGIN_USER, LOGOUT_USER, RELOGIN_USER } from "../Mutations/User.js";
import { SET_CLASSES } from "../Mutations/Admin.js";
import { DELETE_ALL_DATA } from "../Mutations/Admin.js";
import { GET_INFO } from "../Queries/Info.js";
import { UPDATE_INFO } from "../Mutations/Info.js";
import { CALC_FITNESS } from "../Mutations/Fitness.js";
import { GET_ALL_ASSIGNED_DISCIPLINES } from "../Queries/Assigned_Discipline.js";
import { RUN_EA } from "../../Algorithms/EvalutionAlgorithm/Main.js";
import { RUN_SA } from "../../Algorithms/SimpleAlgorithm/Main.js";
import { RUN_SIMULATED_ANNEALING } from "../../Algorithms/SimulatedAnnealingAlgorithm/Main.js";
import { RUN_EACPP } from "../../Algorithms/EvalutionAlgorithmCpp/Main.js";

const RootQuery = new GraphQLObjectType({
  name: "Queries",
  fields: {
    GetAllTeachers: GET_ALL_TEACHERS,
    GetAllAudiences: GET_ALL_AUDIENCES,
    GetAllCathedras: GET_ALL_CATHEDRAS,
    GetAllSpecialties: GET_ALL_SPECIALTY,
    GetAllTypeClasses: GET_ALL_TYPE_CLASSES,
    GetAllGroups: GET_ALL_GROUPS,
    GetAllDisciplines: GET_ALL_DISCIPLINES,
    GetAllClasses: GET_ALL_CLASSES,
    GetAllScheduleGroups: GET_ALL_SCHEDULE_GROUPS,
    GetAllScheduleAudiences: GET_ALL_SCHEDULE_AUDIENCES,
    GetAllScheduleTeachers: GET_ALL_SCHEDULE_TEACHERS,
    GetAllAssignedDisciplines: GET_ALL_ASSIGNED_DISCIPLINES,
    GetInfo: GET_INFO,
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutations",
  fields: {
    CreateTeacher: CREATE_TEACHER,
    DeleteTeacher: DELETE_TEACHER,
    UpdateTeacher: UPDATE_TEACHER,

    CreateAudience: CREATE_AUDIENCE,
    DeleteAudience: DELETE_AUDIENCE,
    UpdateAudience: UPDATE_AUDIENCE,
    AddCathedraToAudience: ADD_CATHEDRA_TO_AUDIENCE,
    DeleteCathedraFromAudience: DELETE_CATHEDRA_FROM_AUDIENCE,

    CreateCathedra: CREATE_CATHEDRA,
    DeleteCathedra: DELETE_CATHEDRA,
    UpdateCathedra: UPDATE_CATHEDRA,

    CreateGroup: CREATE_GROUP,
    UpdateGroup: UPDATE_GROUP,
    DeleteGroup: DELETE_GROUP,

    CreateSpecialty: CREATE_SPECIALTY,
    DeleteSpecialty: DELETE_SPECIALTY,
    UpdateSpecialty: UPDATE_SPECIALTY,

    CreateDiscipline: CREATE_DISCIPLINE,
    UpdateDiscipline: UPDATE_DISCIPLINE,
    DeleteDiscipline: DELETE_DISCIPLINE,
    AddDisciplineToSpecialty: ADD_DISCIPLINE_TO_SPECIALTY,
    DeleteDisciplineFromSpecialty: DELETE_DISCIPLINE_FROM_SPECIALTY,

    CreateClass: CREATE_CLASS,
    UpdateClass: UPDATE_CLASS,
    DeleteClass: DELETE_CLASS,
    AddTeacherToClass: ADD_TEACHER_TO_CLASS,
    AddRecAudienceToClass: ADD_RECOMMENDED_AUDIENCE_TO_CLASS,
    AddRecScheduleToClass: ADD_RECOMMENDED_SCHEDULE_TO_CLASS,
    AddGroupToClass: ADD_GROUP_TO_CLASS,
    DeleteTeacherFromClass: DELETE_TEACHER_FROM_CLASS,
    DeleteRecAudienceFromClass: DELETE_RECOMMENDED_AUDIENCE_FROM_CLASS,
    DeleteRecScheduleFromClass: DELETE_RECOMMENDED_SCHEDULE_FROM_CLASS,
    DeleteGroupFromClass: DELETE_GROUP_FROM_CLASS,

    LoginUser: LOGIN_USER,
    LogoutUser: LOGOUT_USER,
    ReloginUser: RELOGIN_USER,
    SetClasses: SET_CLASSES,
    DeleteAllData: DELETE_ALL_DATA,
    UpdateInfo: UPDATE_INFO,
    RunEA: RUN_EA,
    RunSA: RUN_SA,
    RunSimulatedAnnealing: RUN_SIMULATED_ANNEALING,
    RunEACpp: RUN_EACPP,
    CalcFitness: CALC_FITNESS,
  },
});

const Schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
export default Schema;
