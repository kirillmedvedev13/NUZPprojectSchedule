import { useQuery , useMutation} from "@apollo/client";
import {GetAllCathedras} from "./queries.js";
import {XCircle} from "react-bootstrap-icons";
import { DELETE_CATHEDRA } from "./mutations.js";
import {Alert} from "react-bootstrap"

    function DeleteCathedraComponent({id}){
        let [DeleteCathedraf, { data, loading, error }] = useMutation(DELETE_CATHEDRA, {
            refetchQueries: [
                GetAllCathedras, 
            ],
          });
        if (loading) return <td>Submitting...</td>
        if (error) return <td>`Submission error! ${error.message}`</td>
        console.log(data);
        //  if(!data.successful){
        //    <Alert variant="danger">
        //     data.message;
        //    </Alert>
        // }
        // else{
            return(
                <td className="justify-content-end" ><XCircle className="col" type="button" onClick={() => DeleteCathedraf({variables: {id}})}  /></td>
            )
        //}
    }

    const ExchangeCathedras = () => {
        const {loading, error, data} = useQuery(GetAllCathedras );
        if (loading) return <tr><td>Loading...</td></tr>
        if (error) return <tr><td>`Error! ${error.message}`</td></tr>

        
        return data.GetAllCathedras.map(({id, name}) => (
                <tr key={id}>
                    <td> {name} </td>
                    <DeleteCathedraComponent id={id+1}></DeleteCathedraComponent>
                </tr>
        ));
    }

    export default ExchangeCathedras;