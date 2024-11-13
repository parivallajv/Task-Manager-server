const authenticateToken = (req, res, next) => {
  const token =
    req.cookies.accessToken || req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, ACCESS_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
