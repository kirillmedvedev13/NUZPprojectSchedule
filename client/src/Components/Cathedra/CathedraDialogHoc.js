import {compose} from "react-recompose";
import { graphql } from '@apollo/client/react/hoc';
import { DELETE_CATHEDRA } from "./mutations";

const withGraphQL = compose(
    graphql(DELETE_CATHEDRA,{
        props: ({mutate}) => ({
            DeleteCathedra: cathedra => mutate({
                variables: cathedra,
            })
        })
    }),
);

export default compose(withGraphQL);