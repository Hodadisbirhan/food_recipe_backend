const axios = require("axios").default;
const {endPont,header} =require("./qraohQl");
const excute=async(variables,operation)=>{

const  query_data ={
   variables:variables,
   query: operation
    
}
let errorChecker=true;
do{
    try{
const data = await axios({
headers:header,
url:endPont,
method:"post",
data:query_data
    })

errorChecker=false;
    return data; 
}
   
    catch(err){
errorChecker=true;
    }
    
}while(errorChecker);
}

module.exports=excute;


    