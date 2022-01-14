import { gql } from "@apollo/client";
export const LoginUser = gql`
  mutation LoginUser($email: String, $password: String) {
    LoginUser(email: $email, password: $password) {
      id
      email
      accessToken
      isAuth {
        successful
        message
      }
    }
  }
`;

export const ReloginUser = gql`
  mutation ReloginUser($accessToken: String) {
    ReloginUser(accessToken: $accessToken) {
      id
      email
      accessToken
      isAuth {
        successful
        message
      }
    }
  }
`;
