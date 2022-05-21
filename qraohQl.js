

const header = {

    "content-type":"application/json",
    "x-hasura-admin-secret":"Hodadis1102319."
}
const endPont = "https://hodyfood.herokuapp.com/v1/graphql";

const CREATE_USER_QL = `
mutation($name:String!, $email:String!, $password:String!, $refreshtoken:String!){
    insert_users_one(object:{name:$name, email:$email, password:$password, refreshtoken:$refreshtoken}){
      name
      email

      id
    }
  }
    
  
  
`;
const fetchUser = `
query($email:String!){
    users(where:{email:{_eq:$email}}){
      email
      id
      name
      password
      refreshtoken
    }
  }`

  const fetchByRefresh = `
query($refreshtoken:String!){
    users(where:{refreshtoken:{_eq:$refreshtoken}}){
      name
      id
      email
      password
      refreshtoken
    }
  }
`

module.exports={header,endPont,CREATE_USER_QL,fetchUser,fetchByRefresh};
