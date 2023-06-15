const jwt = require('jsonwebtoken');
const checkLogin = (req, res, next) => {
  const { authorization } = req.headers;

  try {
    const token = authorization.split(' ')[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const { userName, userid } = decode;
    req.userName = userName;
    req.userid = userid;

    next();
  } catch (err) {
    next('Authentication Failure ');
  }
};

module.exports = checkLogin;
