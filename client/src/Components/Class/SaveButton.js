import React from "react";
import { Button } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { CREATE_CLASS, UPDATE_CLASS } from "./mutations";
import { CreateNotification } from "../Alert";

export default function SaveButton({
  item,
  handleCloseModal,
  handleChangeState,
}) {
  const mutation = item.id ? UPDATE_CLASS : CREATE_CLASS;
  const [mutateFunction, { loading, error }] = useMutation(mutation);
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  const variables = item.id
    ? {
      variables: {
        id: +item.id,
        id_assigned_discipline: +item.assigned_discipline.id,
        times_per_week: +item.times_per_week,
        id_type_class: +item.type_class.id,
      },
    }
    : {
      variables: {
        id_assigned_discipline: +item.assigned_discipline.id,
        times_per_week: +item.times_per_week,
        id_type_class: +item.type_class.id,
        assigned_teachers: JSON.stringify(
          item.assigned_teachers.map((item) => {
            return +item.teacher.id;
          })
        ),
        assigned_groups: JSON.stringify(
          item.assigned_groups.map((item) => {
            return +item.group.id;
          })
        ),
        recommended_audiences: JSON.stringify(
          item.recommended_audiences.map((item) => {
            return +item.audience.id;
          })
        ),
      },
    };
  return (
    <Button
      variant="primary"
      onClick={(e) => {
        if (
          item.times_per_week &&
          item.type_class.id &&
          item.assigned_discipline.id
        ) {
          mutateFunction(variables).then((res) => {
            if (item.id) {
              CreateNotification(res.data.UpdateClass);
              if (res.data.UpdateClass.successful) {
                handleCloseModal();
              }
            }
            else {
              CreateNotification(res.data.CreateClass);
              if (res.data.CreateClass.successful) {
                handleCloseModal();
              }
            }
          });
        } else {
          if (!item.times_per_week) {
            handleChangeState("validatedTimesPerWeek", false);
          }
          if (!item.type_class.id) {
            handleChangeState("validatedTypeClass", false);
          }
          if (!item.assigned_discipline.id) {
            handleChangeState("validatedDiscipline", false);
          }
        }
      }}
    >
      {item.id ? "Оновити" : "Додати"}
    </Button >
  );
}
