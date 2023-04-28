import React from "react";
import { Button } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { GET_ALL_SCHEDULE } from "../queries";
import file_saver from "file-saver";

function QueryGetAllSchedule() {
  const { loading, error, data } = useQuery(GET_ALL_SCHEDULE);
  if (loading) return null;
  if (error) return `Error! ${error}`;
  return (
    <Button
      className="w-100"
      onClick={(e) => {
        const blob = new Blob([JSON.stringify(data.GetAllSchedule)], {
          type: "text/plain;charset=utf-8",
        });
        file_saver.saveAs(blob, "schedule.json");
      }}
    >
      Завантажити дані розкладу в json для алгоритму
    </Button>
  );
}

export default class GetSchedule extends React.Component {
  render() {
    return <QueryGetAllSchedule></QueryGetAllSchedule>;
  }
}
