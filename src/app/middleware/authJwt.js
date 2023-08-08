import jsonwebtoken from "jsonwebtoken";

export const verifyJWToken = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1] || "";

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jsonwebtoken.verify(
    token,
    process.env.JSONWEBTOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!",
        });
      }
      req.userId = decoded.id;
      next();
    }
  );
};
