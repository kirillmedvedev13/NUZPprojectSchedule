import {compose} from "react-recompose";
import { graphql } from '@apollo/client/react/hoc';
import { CREATE_CATHEDRA, UPDATE_CATHEDRA } from "./mutations";
import {GetAllCathedras} from "./queries"
const withGraphQL = compose(
    graphql(CREATE_CATHEDRA,{
        props: ({mutate}) => ({
            CreateCathedra: cathedra => mutate({
                variables: cathedra,
                refetchQueries: [{
                    query: GetAllCathedras,
                    variables: {name: ''}
                }]
            })
        })
    }),
    graphql(UPDATE_CATHEDRA,{
        props: ({mutate}) => ({
            UpdateCathedra: cathedra => mutate({
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