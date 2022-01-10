import {compose} from "react-recompose";
import { graphql } from '@apollo/client/react/hoc';

import { GetAllCathedras } from "./queries";

const withGraphQL = graphql(GetAllCathedras, {
    options: ({name = ''}) => ({
        variables: {name}
    }),
});

export default compose(withGraphQL);