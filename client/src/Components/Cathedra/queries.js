import {gql} from "@apollo/client"

export const cathedrasQuery = gql`
    query cathedrasQuery{ 
      GetAllCathedras{
              id
              name
            }
    }
`