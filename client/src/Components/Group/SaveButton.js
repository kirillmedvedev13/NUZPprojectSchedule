import React from "react";
import { Button } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { UPDATE_GROUP, CREATE_GROUP } from "./mutations";
import { CreateNotification } from "../Alert";

export default function SaveButton({
  item,
  handleCloseModal,
  handleChangeState,
}) {
  const mutation = item.id ? UPDATE_GROUP : CREATE_GROUP;
  const [mutateFunction, { loading, error }] = useMutation(mutation);
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  const variables = item.id
    ? {
        variables: {
          id: +item.id,
          name: item.name,
          number_students: +item.number_students,
          semester: +item.semester,
          id_specialty: +item.specialty.id,
        },
      }
    : {
        variables: {
          name: item.name,
          number_students: +item.number_students,
          semester: +item.semester,
          id_specialty: +item.specialty.id,
        },
      };
  return (
    <Button
      variant="primary"
      onClick={(e) => {
        if (
          item.name &&
          item.number_students &&
          item.semester &&
          item.specialty.id
        ) {
          mutateFunction(variables).then((res) => {
            CreateNotification(
              item.id ? res.data.UpdateGroup : res.data.CreateGroup
            );
            handleCloseModal();
          });
        } else {
          if (!item.name) handleChangeState("validatedName", false);
          if (!item.semester) handleChangeState("validatedSemester", false);
          if (!item.number_students)
            handleChangeState("validatedNumberStudents", false);
          if (!item.specialty.id)
            handleChangeState("validatedSpecialty", false);
        }
      }}
    >
      {item.id ? "Оновити" : "Додати"}
    </Button>
  );
}
