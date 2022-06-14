import React from "react";
import { Button } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { UPDATE_DISCIPLINE, CREATE_DISCIPLINE } from "./mutations";
import { CreateNotification } from "../Alert";

export default function SaveButton({
  item,
  handleCloseModal,
  handleChangeState,
}) {
  const mutation = item.id ? UPDATE_DISCIPLINE : CREATE_DISCIPLINE;
  const [mutateFunction, { loading, error }] = useMutation(mutation);
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
      variant="primary"
      onClick={(e) => {
        if (item.name) {
          mutateFunction(variables).then((res) => {
            CreateNotification(
              item.id ? res.data.UpdateDiscipline : res.data.CreateDiscipline
            );
            handleCloseModal();
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
