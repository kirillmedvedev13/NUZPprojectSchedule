import React from "react";
import { Button } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { UPDATE_TEACHER, CREATE_TEACHER } from "./mutations";
import { CreateNotification } from "../Alert";
export default function SaveButton({
  item,
  handleCloseModal,
  handleChangeState,
}) {
  const mutation = item.id ? UPDATE_TEACHER : CREATE_TEACHER;
  const [mutateFunction, { loading, error }] = useMutation(mutation);
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  const variables = item.id
    ? {
        variables: {
          id: +item.id,
          name: item.name,
          surname: item.surname,
          patronymic: item.patronymic,
          id_cathedra: +item.cathedra.id,
        },
      }
    : {
        variables: {
          name: item.name,
          surname: item.surname,
          patronymic: item.patronymic,
          id_cathedra: +item.cathedra.id,
        },
      };
  return (
    <Button
      className="col-md-3 mx-2 my-2"
      variant="primary"
      onClick={(e) => {
        if (item.name && item.surname && item.patronymic && item.cathedra.id) {
          mutateFunction(variables).then((res) => {
            if (item.id) {
              CreateNotification(res.data.UpdateTeacher);
              if (res.data.UpdateTeacher.successful) {
                handleCloseModal();
              }
            } else {
              CreateNotification(res.data.CreateTeacher);
            }
            if (res.data.CreateTeacher.successful) {
              handleCloseModal();
            }
          });
        } else {
          if (!item.name) handleChangeState("validatedName", false);
          if (!item.patronymic) handleChangeState("validatedPatronymic", false);
          if (!item.surname) handleChangeState("validatedSurname", false);
          if (!item.cathedra.id) {
            handleChangeState("validatedCathedra", false);
          }
        }
      }}
    >
      {item.id ? "Оновити" : "Додати"}
    </Button>
  );
}
