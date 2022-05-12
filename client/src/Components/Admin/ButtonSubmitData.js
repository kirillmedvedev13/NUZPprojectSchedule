import React from "react";
import { useMutation } from "@apollo/client";

import { Button } from "react-bootstrap";
import { CreateNotification } from "../Alert";
import ReadFile from "./ReadFile";
import { SET_CLASSES } from "./mutations.js";

export default function ButtonSubmitData({ id_cathedra, file, sheetIndex }) {
  const [SetClasses, { loading, error }] = useMutation(SET_CLASSES, {
    refetchQueries: [],
  });
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  return (
    <Button
      className="col-12"
      onClick={() => {
        if (!id_cathedra || !file) {
          return CreateNotification({
            succesful: false,
            message: "Заповніть дані у формi!",
          });
        }
        ReadFile(file, sheetIndex).then((data) => {
          console.log(JSON.parse(data));
          const variables = { variables: { data, id_cathedra } };
          SetClasses(variables).then((res) => {
            CreateNotification(res.data.SetClasses);
          });
        });
      }}
    >
      Завантажити дані
    </Button>
  );
}
