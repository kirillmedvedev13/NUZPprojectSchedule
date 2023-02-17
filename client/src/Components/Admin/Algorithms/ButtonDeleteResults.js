import React from "react";
import { Button } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { CreateNotification } from "../../Alert.js";
import { DELETE_RESULTS } from "../mutations.js";

export default function ButtonDeleteResults({ name_algorithm, refetch }) {
  const [DeleteResults, { loading, error }] = useMutation(DELETE_RESULTS);
  if (loading) return null;
  if (error) return `Error! ${error}`;
  return (
    <div className="my-2 d-flex justify-content-center">
      <Button
        className="col-12"
        onClick={(e) => {
          DeleteResults({ variables: { name_algorithm } }).then((res) => {
            console.log(res.data);
            CreateNotification(res.data.DeleteResults);
            refetch();
          });
        }}
      >
        Видалити результати алгоритму
      </Button>
    </div>
  );
}
