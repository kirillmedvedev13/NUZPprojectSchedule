import React from "react";
import { Button } from "react-bootstrap";
import { UPDATE_CATHEDRA, CREATE_CATHEDRA } from "./mutations";
import { useMutation } from "@apollo/client";
import { GET_ALL_CATHEDRAS } from "./queries";
import { CreateNotification } from "../Alert";

export default function SaveButton({
  item,
  handleCloseModal,
  handleChangeState,
}) {
  const mutation = item.id ? UPDATE_CATHEDRA : CREATE_CATHEDRA;
  const [mutateFunction, { loading, error }] = useMutation(mutation, {
    refetchQueries: [GET_ALL_CATHEDRAS],
  });
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
      variant="primary"
      onClick={(e) => {
        if (item.name && item.short_name) {
          mutateFunction(variables).then((res) => {
            CreateNotification(
              item.id ? res.data.UpdateCathedra : res.data.CreateCathedra
            );
            handleCloseModal();
          });
        } else {
          if (!item.short_name) handleChangeState("validatedShortName", false);
          if (!item.name) handleChangeState("validatedName", false);
        }
      }}
    >
      {item.id ? "Оновити" : "Додати"}
    </Button>
  );
}
