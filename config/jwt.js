import jsonwebtoken from "jsonwebtoken";

const jwt = {
  signTokenAsync: (payload, options) =>
    new Promise((resolve, reject) => {
      jsonwebtoken.sign(payload, process.env.JWT_SECRET, options, (error, payload) => {
        if (error) reject(error);
        resolve(payload);
      });
    }),

  verifyTokenAsync: (token) =>
    new Promise((resolve, reject) => {
      jsonwebtoken.verify(token, process.env.JWT_SECRET, (error, payload) => {
        if (error) reject(error);
        resolve(payload);
      });
    }),

  extractTokenFromHeader: (req) => {
    const [type, token] = req.headers.authorization?.split(" ") ?? [];

    return type === "Bearer" ? token : null;
  },
};

export default jwt;
