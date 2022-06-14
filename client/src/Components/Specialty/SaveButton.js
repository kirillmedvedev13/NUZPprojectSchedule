import React from "react";
import { Button } from "react-bootstrap";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_SPECIALTY, CREATE_SPECIALTY } from "./mutations";
import { CreateNotification } from "../Alert";
export default function SaveButton({
  item,
  handleCloseModal,
  handleChangeState,
}) {
  const mutation = item.id ? UPDATE_SPECIALTY : CREATE_SPECIALTY;
  const [mutateFunction, { loading, error }] = useMutation(mutation);
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  const variables = item.id
    ? {
        variables: {
          id: +item.id,
          name: item.name,
          code: +item.code,
          id_cathedra: +item.cathedra.id,
        },
      }
    : {
        variables: {
          name: item.name,
          id_cathedra: +item.cathedra.id,
          code: +item.code,
        },
      };
  return (
    <Button
      variant="primary"
      onClick={(e) => {
        if (item.name && item.cathedra.id && item.code !== null) {
          mutateFunction(variables).then((res) => {
            CreateNotification(
              item.id ? res.data.UpdateSpecialty : res.data.CreateSpecialty
            );
            handleCloseModal();
          });
        }
        if (!item.name) handleChangeState("validatedName", false);
        if (!item.cathedra.id) {
          handleChangeState("validatedCathedra", false);
        }
      }}
    >
      {item.id ? "Оновити" : "Додати"}
    </Button>
  );
}
