import { useMutation } from "@apollo/client";
import { Container, Button } from "react-bootstrap";
import { CreateNotification } from "../../Alert";
import { RUN_SA } from "../mutations";

export default function ButtonRunSA({ id_cathedra, refetch }) {
  const [RunSA, { loading, error }] = useMutation(RUN_SA, {
    variables: { id_cathedra },
  });

  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  return (
    <Container>
      <Button
        className="col-12"
        onClick={() => {
          RunSA().then((res) => {
            CreateNotification(res.data.RunSA);
            refetch();
          });
        }}
      >
        Запустити алгоритм
      </Button>
    </Container>
  );
}
