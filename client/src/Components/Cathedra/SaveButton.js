import React from "react";
import { Button } from "react-bootstrap";
import { UPDATE_CATHEDRA, CREATE_CATHEDRA } from "./mutations";
import { useMutation } from "@apollo/client";
import { CreateNotification } from "../Alert";

export default function SaveButton({
  item,
  handleCloseModal,
  handleChangeState,
}) {
  const mutation = item.id ? UPDATE_CATHEDRA : CREATE_CATHEDRA;
  const [mutateFunction, { loading, error }] = useMutation(mutation);
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  const variables = item.id
    ? {
        variables: {
          id: +item.id,
          name: item.name,
          short_name: item.short_name,
        },
      }
    : { variables: { name: item.name, short_name: item.short_name } };
  return (
    <Button
      className="col-md-3 mx-2 my-2"
      variant="primary"
      onClick={(e) => {
        if (item.name && item.short_name) {
          mutateFunction(variables).then((res) => {
            if (item.id) {
              CreateNotification(res.data.UpdateCathedra);
              if (res.data.UpdateCathedra.successful) {
                handleCloseModal();
              }
            } else {
              CreateNotification(res.data.CreateCathedra);
              if (res.data.CreateCathedra.successful) {
                handleCloseModal();
              }
            }
          });
        }
        if (!item.short_name) handleChangeState("validatedShortName", false);
        if (!item.name) handleChangeState("validatedName", false);
      }}
    >
      {item.id ? "Оновити" : "Додати"}
    </Button>
  );
}
