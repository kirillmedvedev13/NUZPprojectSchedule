import { compose } from "react-recompose";
import { graphql } from "@apollo/client/react/hoc";

import { GetUser } from "./queries";

const withGraphQL = graphql(GetUser, {
  options: ({ email = "", password = "" }) => ({
    variables: { email, password },
  }),
});

export default compose(withGraphQL);
