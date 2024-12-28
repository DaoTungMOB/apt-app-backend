const jwt = require("jsonwebtoken");

const ROLE = Object.freeze({
  ADMIN: "admin",
  USER: "user",
});

const generateToken = (payload, secretSignature, tokenLife) => {
  try {
    return jwt.sign(
      {
        payload,
      },
      secretSignature,
      {
        algorithm: "HS256",
        expiresIn: tokenLife,
      }
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};

const verifyToken = (token, secretSignature) => {
  try {
    return jwt.verify(token, secretSignature);
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  ROLE,
  generateToken,
  verifyToken,
};
