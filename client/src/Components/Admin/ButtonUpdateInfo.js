import React from "react";
import { Button } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { UPDATE_INFO } from "./mutations.js";
import { CreateNotification } from "../Alert.js";

export default function ButtonUpdateInfo({ info, refetch }) {
  const [UpdateInfo, { loading, error }] = useMutation(UPDATE_INFO);
  if (loading) return null;
  if (error) return `Error! ${error}`;
  let data = [];
  for (const [key, value] of Object.entries(info)) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      for (const [key1, value1] of Object.entries(value)) {
        if (value1 !== null) {
          let string = JSON.stringify(value);
          data.push({ key, string });
          break;
        }
      }
    } else if (value != null) data.push({ key, value });
  }

  return (
    <div className="my-2 d-flex justify-content-center">
      <Button
        className="col-12"
        onClick={(e) => {
          if (data.length === 0) return;
          else
            UpdateInfo({ variables: { data: JSON.stringify(data) } }).then(
              (res) => {
                CreateNotification(res.data.UpdateInfo);
                refetch();
              }
            );
        }}
      >
        Оновити данi
      </Button>
    </div>
  );
}
