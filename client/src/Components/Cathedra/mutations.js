import {gql} from "@apollo/client"

export const DELETE_CATHEDRA = gql`
mutation DeleteCathedra($id: ID!){
  DeleteCathedra(id: $id){
	  message
    successful
  }
}
`
export const UPDATE_CATHEDRA = gql`
  mutation UpdateCathedra($id: ID!, $name: String!){
  UpdateCathedra(id: $id, name: $name){
    message
    successful
  }
}
`
export const CREATE_CATHEDRA = gql`
    mutation CreateCathedra($name: String){ 
      CreateCathedra(name: $name){
              message
              successful
            }
    }
    `
