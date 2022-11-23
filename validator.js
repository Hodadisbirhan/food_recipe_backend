const {express} = require("express");

const excute = require("./connecttoHasura");
const { fetchUser }= require("./qraohQl");


const validator =async(req,res,next)=>{

const data = req.body;
console.log(data,"okey");
if(data&&data.name.trim()&&data.email.trim()&&data.password)
{
    let errorChecker = true;
    
    
        try{
const fetch_user = await excute({email:data.email},fetchUser);

if(fetch_user.data.data.users.length>0 &&data.email==fetch_user.data.data.users[0].email){
console.log("Email is already used");
   return res.status(201).json({erro:"the Email is already used"});

}
     
errorChecker=false
    
    }
    catch(error)
    {
        errorChecker=true;
        console.log("ERROROROR");
    }

  

    next();

}
else{

   return res.status(201).json({erro:"please fill the form correctly"});
}
}
const validatorLogin=async(req,res,next)=>
{
    const {email,password} = req.body;
    console.log(email);

    if(email&&password)

    {



next();




    }

    else{

        res.status(201).json({erro:"Please fill the Form"});

    }






}








module.exports ={validator,validatorLogin};