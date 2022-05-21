const PermittedOrgin =require("./permitedOrgin");

const creafeentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (PermittedOrgin.includes(origin)) {
      res.header("Access-Control-Allow-Credentials", true);
    }
    next();
  };
  
  module.exports = creafeentials;
  