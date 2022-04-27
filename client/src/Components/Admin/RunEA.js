import { RUN_EA,  } from "./mutations.js";
import {useMutation} from "@apollo/client"
import { Container, Button} from "react-bootstrap";
import { CreateNotification } from "../Alert";

export default function RunEA(){
    const [RunEA, {loading,error}] = useMutation(RUN_EA, {refetchQueries: []});
    if (loading) return "Submitting...";
    if (error) return `Submission error! ${error.message}`;
    return (
      <Container>
        <Button
        onClick={() => {
          RunEA().then(res => {
            CreateNotification(res.data.RunEA);
          })
        }}
        >
          Запустити алгоритм</Button>
      </Container>
    )
  }