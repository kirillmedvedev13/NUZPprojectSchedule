import { gql } from "@apollo/client";
export const GetAllSpecialties = gql`
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