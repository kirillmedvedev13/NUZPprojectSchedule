import {gql} from "@apollo/client"

export const DELETE_CATHEDRA = gql`
mutation ($id: ID!){
  DeleteCathedra(id: $id){
	  message
    successful
  }
}
`
export const UPDATE_CATHEDRA = gql`
  mutation ($id: ID!, $name: String!){
  UpdateCathedra(id: $id, name: $name){
    message
    successful
  }
}
`