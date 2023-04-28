import React from "react";
import { Button } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { UPDATE_DISCIPLINE, CREATE_DISCIPLINE } from "./mutations";
import { CreateNotification } from "../Alert";
import { GET_ALL_ASSIGNED_DISCIPLINES } from "../SelectsModalWindow/queries";

export default function SaveButton({
  item,
  handleCloseModal,
  handleChangeState,
}) {
  const mutation = item.id ? UPDATE_DISCIPLINE : CREATE_DISCIPLINE;
  const [mutateFunction, { loading, error }] = useMutation(mutation, {
    updateQueries: [{ query: GET_ALL_ASSIGNED_DISCIPLINES }],
  });
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  const variables = item.id
    ? {
        variables: {
          id: +item.id,
          name: item.name,
        },
      }
    : {
        variables: {
          name: item.name,
          assigned_disciplines: JSON.stringify(item.assigned_disciplines),
        },
      };
  return (
    <Button
      className="col-md-3 mx-2 my-2"
      variant="primary"
      onClick={(e) => {
        if (item.name) {
          mutateFunction(variables).then((res) => {
            if (item.id) {
              CreateNotification(res.data.UpdateDiscipline);
              if (res.data.UpdateDiscipline.successful) handleCloseModal();
            } else {
              CreateNotification(res.data.CreateDiscipline);
              if (res.data.CreateDiscipline.successful) {
                handleCloseModal();
              }
            }
          });
        } else {
          if (!item.name) handleChangeState("validatedName", false);
        }
      }}
    >
      {item.id ? "Оновити" : "Додати"}
    </Button>
  );
}
