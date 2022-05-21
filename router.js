
const express = require("express");

const fs = require('fs');
const imgUploader = require("imgbb-uploader");
const pathe = require("path");
const {CREATE_USER_QL,fetchUser,fetchByRefresh}=require("./qraohQl");
const excute = require("./connecttoHasura");
const {validator,validatorLogin} = require("./validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = express.Router();


const cookieParser= require("cookie-parser");
router.use(cookieParser());

router.post("/register",validator,async(req,res)=>{
 const refreshToken = jwt.sign(req.body.email,process.env.REFRSH_TOKEN_SECRET);

let serverChecker=true;
try{
const {data} = await excute({name:req.body.name,email:req.body.email,password:req.body.password,refreshtoken:refreshToken},CREATE_USER_QL)



const claim = {
    "name":req.body.name,
    "https://hasura.io/jwt/claims": {
"x-hasura-allowed-roles": ["editor","user","admin", "mod","default"],
"x-hasura-default-role": "admin",
}
}

const accessToken = jwt.sign(claim,process.env.ACCESS_TOKEN_SECRET,{expiresIn:"30m"});
res.cookie('jwt',refreshToken,{maxAge:7*24*60*60*1000,sameSite:"none",httpOnly:true,secure:true})

res.json({accessToken,name:req.body.name,id:data.data.insert_users_one.id,email:data.data.insert_users_one.email});
}
catch(e)
{
    
    const claim = {
      
      "https://hasura.io/jwt/claims": {
  "x-hasura-allowed-roles": ["editor","user","admin", "mod","default"],
  "x-hasura-default-role": "default",
  }
  }

  
const accessToken = jwt.sign(claim,process.env.ACCESS_TOKEN_SECRET,{expiresIn:"30m"});


   
    return res.json({accessToken})
}

})


router.post('/login',validatorLogin,async(req,res)=>{

const {password}  = req.body;
let serverChecker=true;
 do{
 try{
    const  data = await excute({email:req.body.email},fetchUser);
    serverChecker=false;
 
        if(data.data.data.users.length>=1){
           
    if(data.data.data.users[0].password===password.toString())
{

    const claim = {
        "name":data.data.data.users[0].name,
        "https://hasura.io/jwt/claims": {
    "x-hasura-allowed-roles": ["editor","user","admin", "mod","default"],
    "x-hasura-default-role": "admin",
}
    }

    const accessToken = jwt.sign(claim,process.env.ACCESS_TOKEN_SECRET,{expiresIn:"30m"});
    res.cookie('jwt',data.data.data.users[0].refreshtoken,{maxAge:7*24*60*60*1000,httpOnly:true,sameSite:"none",secure:true});
   return  res.status(200).json({accessToken,name:data.data.data.users[0].name,id:data.data.data.users[0].id,email:data.data.data.users[0].email})



}


    else{


      const claim = {
       
        "https://hasura.io/jwt/claims": {
    "x-hasura-allowed-roles": ["editor","user","admin", "mod","default"],
    "x-hasura-default-role": "default",
}
    }

    const accessToken = jwt.sign(claim,process.env.ACCESS_TOKEN_SECRET,{expiresIn:"30m"});

 return res.status(201).json({erro:"your Passord and Email Do not matched",accessToken});
}
      
}
           else{

            const claim = {
       
              "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ["editor","user","admin", "mod","default"],
          "x-hasura-default-role": "default",
      }
          }
      
          const accessToken = jwt.sign(claim,process.env.ACCESS_TOKEN_SECRET,{expiresIn:"30m"});
      


                return   res.status(201).json({erro:"your Passord and Email Do not matched",accessToken});
                 }
 }

 catch(err){
 
 serverChecker=true;
 }
 }
 while(serverChecker);
}

)


router.get("/logout",async(req,res)=>
{
  

if(req.cookies.jwt){

res.clearCookie('jwt',{sameSite:"none",httpOnly:true, secure: true})

}

const claim = {
    
    "https://hasura.io/jwt/claims": {
"x-hasura-allowed-roles": ["editor","user","admin", "mod","default"],
"x-hasura-default-role": "default",
}
}

const accessToken = jwt.sign(claim,process.env.ACCESS_TOKEN_SECRET,{expiresIn:"30m"});

return res.json({clear:"successfully",accessToken});
})

router.get('/refresh',async(req,res)=>{

if(req.cookies.jwt){

    try{
        

        const  data = await excute({refreshtoken:req.cookies.jwt},fetchByRefresh);

    
    if(data.data.data.users[0].refreshtoken==req.cookies.jwt.toString())
{
    const claim = {
        "name":data.data.data.users[0].name,
        "https://hasura.io/jwt/claims": {
    "x-hasura-allowed-roles": ["editor","user","admin", "mod","default"],
    "x-hasura-default-role": "admin",
}
    }

    const accessToken = jwt.sign(claim,process.env.ACCESS_TOKEN_SECRET,{expiresIn:"30m"});
    res.cookie('jwt',data.data.data.users[0].refreshtoken,{maxAge:7*24*60*60*1000,httpOnly:true,sameSite:"none",secure:true});
 return   res.status(200).json({accessToken,name:data.data.data.users[0].name,id:data.data.data.users[0].id,email:data.data.data.users[0].email})

}

}
catch(d){

}
}

const claim = {
    
    "https://hasura.io/jwt/claims": {
"x-hasura-allowed-roles": ["editor","user","admin", "mod","default"],
"x-hasura-default-role": "default",
}
}

const accessToken = jwt.sign(claim,process.env.ACCESS_TOKEN_SECRET,{expiresIn:"30m"});

return res.status(200).json({accessToken});


})




   
    router.post("/uploadImage", async (req, res) => {
        try {
          const { filename, base64img } = req.body;
      
          const base64str = () =>
            new Promise((resolve) => {
              return setTimeout(() => {
                resolve(base64img);
              }, 1000);
            });
      
          return await imgUploader({
            apiKey: process.env.IMBB_KEY_SECRET,
            base64string: await base64str(),
            name: filename,
            timeout: 3000,
          })
            .then((result) => {
              return res.json({ success: true, url: result.url });
            })
            .catch((e) => {
              // return Difault image in case of Time Out
              return res.json({
                success: false,
                url:
                  "https://img.freepik.com/free-photo/big-hamburger-with-double-beef-french-fries_252907-8.jpg?w=2000",
              });
            });
        } catch (error) {
          return res.json({
            success: false,
            url:
              "https://img.freepik.com/free-photo/big-hamburger-with-double-beef-french-fries_252907-8.jpg?w=2000",
          });
        }
      });











module.exports= router;

