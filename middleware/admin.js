module.exports = function(req, res, next) {
  if (!req.user.admin) return res.redirect("/users/login");
  next();
};