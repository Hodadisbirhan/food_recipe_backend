const origins = require("./allowedOrigines");
const corsOptions = {
  origin: (origin, callback) => {
    if (origins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed by CORES"));
    }
  },

  optionsSuccessStatus: 200,};

  module.exports = corsOptions;
  