import { RUN_EA } from "./mutations.js";
import { useMutation } from "@apollo/client";
import { Container, Button } from "react-bootstrap";
import { CreateNotification } from "../Alert";

export default function ButtonRunEA({ filters }) {
  const {
    population_size,
    max_generations,
    p_crossover,
    p_mutation,
    p_genes,
    penaltyGrWin,
    penaltyTeachWin,
    penaltyLateSc,
    penaltyEqSc,
    penaltySameTimesSc,
  } = filters;

  const [RunEA, { loading, error }] = useMutation(RUN_EA, {
    refetchQueries: [],
    variables: {
      population_size,
      max_generations,
      p_crossover,
      p_mutation,
      p_genes,
      penaltyGrWin,
      penaltyTeachWin,
      penaltyLateSc,
      penaltyEqSc,
      penaltySameTimesSc,
    },
  });
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  return (
    <Container>
      <Button
        className="col-12"
        onClick={() => {
          RunEA(
            population_size,
            max_generations,
            p_crossover,
            p_mutation,
            p_genes,
            penaltyGrWin,
            penaltyTeachWin,
            penaltyLateSc,
            penaltyEqSc,
            penaltySameTimesSc
          ).then((res) => {
            CreateNotification(res.data.RunEA);
          });
        }}
      >
        Запустити алгоритм
      </Button>
    </Container>
  );
}
