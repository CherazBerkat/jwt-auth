import jwt from "jsonwebtoken";

export default function authenticateToken(req, res, next) {
  console.log(req.cookies);
  const token = req.cookies.token; // Get the token from the HTTP-only cookie
  if (!token) {
    return res.json({ message: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, /* process.env.JWT_SECRET */ "secret");
    req.user = decoded.user; // Attach the user payload to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.json({ message: "Token is not valid" });
  }
}
