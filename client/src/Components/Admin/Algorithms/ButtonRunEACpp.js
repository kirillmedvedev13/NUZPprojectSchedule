import { useMutation } from "@apollo/client";
import { Container, Button } from "react-bootstrap";
import { CreateNotification } from "../../Alert";
import { RUN_EACpp } from "../mutations";

export default function ButtonRunEACpp({ id_cathedra, refetch }) {
    const [RunEACpp, { loading, error }] = useMutation(RUN_EACpp, {
        variables: { id_cathedra },
    });

    if (loading) return "Submitting...";
    if (error) return `Submission error! ${error.message}`;
    return (
        <Container>
            <Button
                className="col-12 my-2"
                onClick={() => {
                    RunEACpp().then((res) => {
                        CreateNotification(res.data.RunEACpp);
                        refetch();
                    });
                }}
            >
                Запустити алгоритм Cpp
            </Button>
        </Container>
    );
}
