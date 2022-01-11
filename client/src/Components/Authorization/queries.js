import gql from "@appollo/client";
export const GetUser = gql`
query GetUser($email:String,$password:String){
    GetUser(email:$email,password:$password){
        id
        email
        jwtToken
        isAuth:{
            successful
            message
        }
    }
}
`;
