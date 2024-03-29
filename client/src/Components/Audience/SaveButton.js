import React from "react";
import { Button } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { UPDATE_AUDIENCE, CREATE_AUDIENCE } from "./mutations";

import { CreateNotification } from "../Alert";

export default function SaveButton({
  item,
  handleCloseModal,
  handleChangeState,
}) {
  const mutation = item.id ? UPDATE_AUDIENCE : CREATE_AUDIENCE;
  const [mutateFunction, { loading, error }] = useMutation(mutation);
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  const variables = item.id
    ? {
        variables: {
          id: +item.id,
          name: item.name,
          capacity: +item.capacity,
          id_type_class: +item.type_class.id,
        },
      }
    : {
        variables: {
          name: item.name,
          capacity: +item.capacity,
          id_type_class: +item.type_class.id,
          assigned_cathedras: JSON.stringify(item.assigned_audiences),
        },
      };
  return (
    <Button
      className="col-md-3 mx-2 my-2"
      variant="primary"
      onClick={(e) => {
        if (item.name && item.capacity) {
          mutateFunction(variables).then((res) => {
            if (item.id) {
              CreateNotification(res.data.UpdateAudience);
              if (res.data.UpdateAudience.successful) {
                handleCloseModal();
              }
            } else {
              CreateNotification(res.data.CreateAudience);
              if (res.data.CreateAudience.successful) {
                handleCloseModal();
              }
            }
          });
        } else {
          if (!item.type_class.id)
            handleChangeState("validatedTypeClass", false);
          if (!item.name) handleChangeState("validatedName", false);
          if (!item.capacity) handleChangeState("validatedCapacity", false);
        }
      }}
    >
      {item.id ? "Оновити" : "Додати"}
    </Button>
  );
}
