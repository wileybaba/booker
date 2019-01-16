const jwt = require('jsonwebtoken');

module.exports = (ctx, next) => {
  const authHeader = ctx.get('Authorization');
  if (!authHeader) {
    ctx.authenticated = false;
    return next();
  }
  const token = authHeader.split(' ')[1];
  if (!token || token === '') {
    ctx.authenticated = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'goodLuckCrackingThisReallyLongString');
  } catch (err) {
    req.authenticated = false;
    return next();
  }
  if (!decodedToken) {
    req.authenticated = false;
    return next();
  }
  ctx.authenticated = true;
  ctx.userId = decodedToken.userId;
  next();
}
