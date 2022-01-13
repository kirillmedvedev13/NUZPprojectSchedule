import {gql} from "@apollo/client"

export const DeleteSpecialty = gql`
mutation ($id: ID!){
  DeleteSpecialty(id: $id){
	  message
    successful
  }
}
`
export const UpdateSpecialty = gql`
  mutation ($id: ID!, $name: String!){
  UpdateSpecialty(id: $id, name: $name){
    message
    successful
  }
}
`
export const CreateSpecialty = gql`
    mutation ($name: String, $id_cathedra: Int){ 
      CreateSpecialty(name: $name, id_cathedra: $id_cathedra){
              message
              successful
            }
    }
    `
