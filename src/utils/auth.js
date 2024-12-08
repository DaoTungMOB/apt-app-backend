const jwt = require("jsonwebtoken");

const AuthUtil = {
  generateToken: (payload, secretSignature, tokenLife) => {
    try {
      return jwt.sign(
        {
          payload,
        },
        secretSignature,
        {
          algorithm: "HS256",
          expiresIn: tokenLife,
        },
      );
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  verifyToken: (token, secretSignature) => {
    try {
      return jwt.verify(token, secretSignature);
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};

module.exports = AuthUtil;
