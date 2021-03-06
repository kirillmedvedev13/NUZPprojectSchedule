import { RUN_EA } from "./mutations.js";
import { useMutation } from "@apollo/client";
import { Container, Button } from "react-bootstrap";
import { CreateNotification } from "../Alert";

export default function ButtonRunEA({ id_cathedra }) {
  const [RunEA, { loading, error }] = useMutation(RUN_EA, {
    variables: { id_cathedra },
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
