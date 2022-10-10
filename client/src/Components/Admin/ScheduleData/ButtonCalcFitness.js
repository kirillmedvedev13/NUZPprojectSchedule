import { Button } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { CreateNotification } from "../../Alert";
import { CALC_FITNESS } from "../mutations"

export default function ButtonCalcFitness({ refetch }) {
  const [CalcFitness, { loading, error }] = useMutation(CALC_FITNESS);
  if (loading) return null;
  if (error) return `Error! ${error}`;
  return (
    <div className=" d-flex justify-content-center">
      <Button
        className="col-12"
        onClick={() => {
          CalcFitness().then((res) => {
            CreateNotification(res.data.CalcFitness);
            refetch();
          });
        }}
      >
        Порахувати значення фiтнес
      </Button>
    </div>
  );
}
