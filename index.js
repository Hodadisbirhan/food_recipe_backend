

const express = require("express");
const rout = require("./router");
const body_Parser = require("body-parser");
const Credentials= require("./credential");
const app = express();
app.use(body_Parser.json({ limit: "50mb" }));
app.use(body_Parser.urlencoded({ limit: "50mb", extended: true }));
const cors = require("cors");
const permittedOrgin = require("./permitedOrgin");
app.use(Credentials);
app.use(cors({origin:permittedOrgin,credentials:true,},))
 app.use(express.json());
 app.use("/user",rout);
app.use(express.urlencoded({extended:true}));
app.listen(5000,()=>{

})


