import { gql } from "@apollo/client";

export const DELETE_CLASS = gql`
  mutation ($id: ID!) {
    DeleteClass(id: $id) {
      message
      successful
    }
  }
`;
export const UPDATE_CLASS = gql`
  mutation (
    $id: ID!
    $id_type_class: Int!
    $times_per_week: Float!
    $id_assigned_discipline: Int!
  ) {
    UpdateClass(
      id: $id
      id_type_class: $id_type_class
      times_per_week: $times_per_week
      id_assigned_discipline: $id_assigned_discipline
    ) {
      message
      successful
    }
  }
`;
export const CREATE_CLASS = gql`
  mutation (
    $id_type_class: Int!
    $times_per_week: Float!
    $id_assigned_discipline: Int!
    $assigned_teachers: String
    $assigned_groups: String
    $recommended_audiences: String
  ) {
    CreateClass(
      id_type_class: $id_type_class
      times_per_week: $times_per_week
      id_assigned_discipline: $id_assigned_discipline
      assigned_teachers: $assigned_teachers
      assigned_groups: $assigned_groups
      recommended_audiences: $recommended_audiences
    ) {
      message
      successful
    }
  }
`;

export const ADD_TEACHER_TO_CLASS = gql`
  mutation ($id_teacher: ID!, $id_class: ID!) {
    AddTeacherToClass(id_teacher: $id_teacher, id_class: $id_class) {
      message
      successful
      data
    }
  }
`;

export const ADD_RECOMMENDED_AUDIENCE_TO_CLASS = gql`
  mutation ($id_audience: ID!, $id_class: ID!) {
    AddRecAudienceToClass(id_audience: $id_audience, id_class: $id_class) {
      message
      successful
      data
    }
  }
`;
export const ADD_RECOMMENDED_SCHEDULE_TO_CLASS = gql`
  mutation ($id_class: ID!, $number_pair: Int!, $day_week: Int!) {
    AddRecScheduleToClass(
      id_class: $id_class
      number_pair: $number_pair
      day_week: $day_week
    ) {
      message
      successful
      data
    }
  }
`;
export const ADD_GROUP_TO_CLASS = gql`
  mutation ($id_group: String!, $id_class: ID!) {
    AddGroupToClass(id_group: $id_group, id_class: $id_class) {
      message
      successful
      data
    }
  }
`;
export const DELETE_TEACHER_FROM_CLASS = gql`
  mutation ($id: ID!) {
    DeleteTeacherFromClass(id: $id) {
      message
      successful
    }
  }
`;
export const DELETE_RECOMMENDED_AUDIENCE_FROM_CLASS = gql`
  mutation ($id: ID!) {
    DeleteRecAudienceFromClass(id: $id) {
      message
      successful
    }
  }
`;
export const DELETE_RECOMMENDED_SCHEDULE_FROM_CLASS = gql`
  mutation ($id: ID!) {
    DeleteRecScheduleFromClass(id: $id) {
      message
      successful
    }
  }
`;

export const DELETE_GROUP_FROM_CLASS = gql`
  mutation ($id: ID!) {
    DeleteGroupFromClass(id: $id) {
      message
      successful
    }
  }
`;
