import { CreateNotification } from "../Alert";
import { DELETE_ALL_DATA } from "./mutations.js";
import { useMutation } from "@apollo/client";
import { Button } from "react-bootstrap";
import { GET_ALL_AUDIENCES } from "../Audience/queries";
import { GET_ALL_TEACHERS } from "../Teacher/queries";
import { GET_ALL_ASSIGNED_DISCIPLINES } from "../SelectsModalWindow/queries";
import { GET_ALL_DISCIPLINES } from "../Discipline/queries";
import { GET_ALL_GROUPS } from "../Group/queries";
import { GET_ALL_CLASSES } from "../Class/queries";
import { GET_ALL_SPECIALTIES } from "../Specialty/queries";
export function ButtonDeleteAllData({ id_cathedra }) {
  const [DeleteAllData, { loading, error }] = useMutation(DELETE_ALL_DATA, {
    refetchQueries: [
      { query: GET_ALL_AUDIENCES },
      { query: GET_ALL_TEACHERS },
      { query: GET_ALL_ASSIGNED_DISCIPLINES },
      { query: GET_ALL_DISCIPLINES },
      { query: GET_ALL_GROUPS },
      { query: GET_ALL_CLASSES },
      { query: GET_ALL_SPECIALTIES },
    ],
    variables: { id_cathedra },
  },
  );
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
