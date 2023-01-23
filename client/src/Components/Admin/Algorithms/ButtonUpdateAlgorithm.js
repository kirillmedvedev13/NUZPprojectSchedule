import React from "react";
import { Button } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { CreateNotification } from "../../Alert.js";
import { UPDATE_ALGORITHM } from "../mutations.js";

export default function ButtonUpdateAlgorithm({ name, params, refetch }) {
  const [UpdateAlgorithm, { loading, error }] = useMutation(UPDATE_ALGORITHM);
  if (loading) return null;
  if (error) return `Error! ${error}`;
  return (
    <div className="my-2 d-flex justify-content-center">
      <Button
        className="col-12"
        onClick={(e) => {
          UpdateAlgorithm({ variables: { name, params } }).then((res) => {
            CreateNotification(res.data.UpdateAlgorithm);
            refetch();
          });
        }}
      >
        Оновити параметри алгоритму
      </Button>
    </div>
  );
}
