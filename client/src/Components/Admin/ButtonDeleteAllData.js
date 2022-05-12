import { CreateNotification } from "../Alert";
import { DELETE_ALL_DATA } from "./mutations.js";
import { useMutation } from "@apollo/client";
import { Button } from "react-bootstrap";

export function ButtonDeleteAllData() {
  const [DeleteAllData, { loading, error }] = useMutation(DELETE_ALL_DATA, {
    refetchQueries: [],
  });
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;

  return (
    <Button
      className="col-12"
      onClick={() => {
        DeleteAllData().then((res) => {
          CreateNotification(res.data.DeleteAllData);
        });
      }}
    >
      Видалити
    </Button>
  );
}
