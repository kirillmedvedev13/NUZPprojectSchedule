import { useQuery } from "@apollo/client";
import {cathedrasQuery} from "./queries.js"

    const ExchangeCathedras = () => {
        const {loading, error, data} = useQuery(cathedrasQuery );
        if (loading) return <tr><td>Loading...</td></tr>
        if (error) return <tr><td>`Error! ${error.message}`</td></tr>

        return data.GetAllCathedras.map(({id, name}) => (
                <tr key={id}>
                    <td> {name} </td>
                </tr>
        ));
    }

    export default ExchangeCathedras;