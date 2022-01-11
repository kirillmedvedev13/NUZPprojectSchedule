import {compose} from "react-recompose";
import { graphql } from '@apollo/client/react/hoc';
import { CREATE_CATHEDRA, UPDATE_CATHEDRA } from "./mutations";
import {GetAllCathedras} from "./queries"
const withGraphQL = compose(
    graphql(CREATE_CATHEDRA, {
        props: ({mutate}) => ({
            CreateCathedra: (cathedra, filters) => mutate({
                variables: cathedra,
                refetchQueries: [{
                    query: GetAllCathedras,
                    variables: filters
                }]
            },)
        })
    }),
    graphql(UPDATE_CATHEDRA,{
        props: ({mutate}) => ({
            UpdateCathedra: (cathedra, filters) => mutate({
                variables: cathedra,
                refetchQueries: [{
                    query: GetAllCathedras,
                    variables: filters,
                }],
            })
        })
    }),
);

export default compose(withGraphQL);