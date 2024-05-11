require("dotenv").config();

const authentication = (req, res, next) => {
  const apikey = req.headers["x-api-key"];

  if (!apikey) {
    return res.status(401).json({
      message: "API key is required",
    });
  }

  if (apikey !== process.env.API_KEY) {
    return res.status(403).json({
      message: "Invalid API key",
    });
  }

  next();
};

module.exports = authentication;
