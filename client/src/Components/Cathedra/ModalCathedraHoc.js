import {compose} from "react-recompose";
import { graphql } from '@apollo/client/react/hoc';
import { CREATE_CATHEDRA, UPDATE_CATHEDRA } from "./mutations";

const withGraphQL = compose(
    graphql(CREATE_CATHEDRA, {
        props: ({mutate}) => ({
            CreateCathedra: (cathedra) => mutate({
                variables: cathedra,
                })
        })
    }),
    graphql(UPDATE_CATHEDRA,{
        props: ({mutate}) => ({
            UpdateCathedra: (cathedra) => mutate({
                variables: cathedra,
            })
        })
    }),
);

export default compose(withGraphQL);