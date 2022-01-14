import { gql } from "@apollo/client";
export const GET_ALL_SPECIALTIES= gql`
query($name: String, $id_cathedra: Int ){
  GetAllSpecialties(name: $name, id_cathedra: $id_cathedra){
    name,
    id,
    cathedra{
      id,
      name
    }
  }
}
`