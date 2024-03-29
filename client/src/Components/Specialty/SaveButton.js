import React from "react";
import { Button } from "react-bootstrap";
import { useMutation } from "@apollo/client";
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
      className="col-md-3 mx-2 my-2"
      variant="primary"
      onClick={(e) => {
        if (item.name && item.cathedra.id && item.code !== null) {
          mutateFunction(variables).then((res) => {
            if (item.id) {
              CreateNotification(res.data.UpdateSpecialty);
              if (res.data.UpdateSpecialty.successful) {
                handleCloseModal();
              }
            } else {
              CreateNotification(res.data.CreateSpecialty);
              if (res.data.CreateSpecialty.successful) {
                handleCloseModal();
              }
            }
          });
        }
        if (!item.name) handleChangeState("validatedName", false);
        if (!item.cathedra.id) {
          handleChangeState("validatedCathedra", false);
        }
        if (!item.code) {
          handleChangeState("validatedCode", false);
        }
      }}
    >
      {item.id ? "Оновити" : "Додати"}
    </Button>
  );
}
