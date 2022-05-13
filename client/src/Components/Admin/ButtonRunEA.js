import { RUN_EA } from "./mutations.js";
import { useMutation } from "@apollo/client";
import { Container, Button } from "react-bootstrap";
import { CreateNotification } from "../Alert";
import { GET_ALL_SCHEDULE_AUDIENCES, GET_ALL_SCHEDULE_GROUPS, GET_ALL_SCHEDULE_TEACHERS } from "../Schedule/queries"

export default function ButtonRunEA() {

  const [RunEA, { loading, error }] = useMutation(RUN_EA, {
    refetchQueries: [GET_ALL_SCHEDULE_AUDIENCES, GET_ALL_SCHEDULE_GROUPS, GET_ALL_SCHEDULE_TEACHERS],
  });
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  return (
    <Container>
      <Button
        className="col-12"
        onClick={() => {
          RunEA().then((res) => {
            CreateNotification(res.data.RunEA);
          });
        }}
      >
        Запустити алгоритм
      </Button>
    </Container>
  );
}
