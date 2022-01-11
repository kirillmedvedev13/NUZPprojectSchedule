import {compose} from "react-recompose";
import { graphql } from '@apollo/client/react/hoc';
import { DELETE_CATHEDRA } from "./mutations";
import {GetAllCathedras} from "./queries"

const withGraphQL = compose(
    graphql(DELETE_CATHEDRA,{
        props: ({mutate}) => ({
            DeleteCathedra: cathedra => mutate({
                variables: cathedra,
                refetchQueries: [{
                    query: GetAllCathedras,
                    variables: {name: ''}
                }]
            })
        })
    }),
);

export default compose(withGraphQL);