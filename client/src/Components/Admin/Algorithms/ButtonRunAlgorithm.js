import { useMutation } from "@apollo/client";
import { Container, Button } from "react-bootstrap";
import { CreateNotification } from "../../Alert";
import { RUN_ALGORITHM } from "../mutations";

export default function ButtonRunAlgorithm({ name, id_cathedra, refetch }) {
  const [RunAlgorithm, { loading, error }] = useMutation(RUN_ALGORITHM, {
    variables: { name, id_cathedra },
  });

  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  return (
    <Container>
      <Button
        className="col-12 my-2"
        onClick={() => {
          RunAlgorithm().then((res) => {
            CreateNotification(res.data.RunAlgorithm);
            refetch();
          });
        }}
      >
        Запустити алгоритм
      </Button>
    </Container>
  );
}
