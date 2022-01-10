import {gql} from "@apollo/client"

export const DELETE_CATHEDRA = gql`
mutation ($id: ID!){
  DeleteCathedra(id: $id){
	  message
    successful
  }
}
`