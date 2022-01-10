import {gql} from "@apollo/client"

export const GetAllCathedras = gql`
    query cathedrasQuery{ 
      GetAllCathedras{
              id
              name
            }
    }
`