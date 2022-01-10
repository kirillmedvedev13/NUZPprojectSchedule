import { useQuery , useMutation} from "@apollo/client";
import {GetAllCathedras} from "./queries.js";
import {XCircle, PencilSquare} from "react-bootstrap-icons";
import { DELETE_CATHEDRA, UPDATE_CATHEDRA } from "./mutations.js";

    function DeleteCathedraComponent({id}){
        const [DeleteCathedraF, {loading, error }] = useMutation(DELETE_CATHEDRA, {
            refetchQueries: [
                GetAllCathedras, 
            ],
            update(
                cache, {data: {DeleteCathedra}}
            ){
                
            }

          });
        if (loading) return <td>Submitting...</td>
        if (error) return <td>`Submission error! ${error.message}`</td>
            return(
                    <XCircle className="mx-1" type="button" onClick={() => DeleteCathedraF({variables: {id}})}  />
            )
    }

    function UpdateCathedraComponent({id,name, handleOpenModal}){
        const [UpdateCathedraF, {loading, error}] = useMutation(UPDATE_CATHEDRA, {
            refetchQueries: [
                GetAllCathedras, 
            ],
            update(
                cache, {data: {UpdateCathedra}}
            ){
        
            }
        });
        
        if (loading) return <td>Submitting...</td>
        if (error) return <td>`Submission error! ${error.message}`</td>


        return(
            <>
                <PencilSquare className="mx-1" type="button" onClick={handleOpenModal(id,name)}  />
            </>
        )
    }

    const ExchangeCathedras = ({handleOpenModal}) => {
        const {loading, error, data} = useQuery(GetAllCathedras );
        if (loading) return <tr><td>Loading...</td></tr>
        if (error) return <tr><td>`Error! ${error.message}`</td></tr>

        
        return data.GetAllCathedras.map(({id, name}) => (
                <tr key={id} >
                    <td> {name} </td>
                    <td className="col-2">
                        <UpdateCathedraComponent id={id} name={name} handleOpenModal={handleOpenModal}></UpdateCathedraComponent>
                        <DeleteCathedraComponent id={id}></DeleteCathedraComponent>
                    </td>
                </tr>
        ));
    }

    export default ExchangeCathedras;