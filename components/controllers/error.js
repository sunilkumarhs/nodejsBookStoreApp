exports.getErrorPage = (req, res, next) => {
  res.status(404).render("404", {
    docTitle: "Page Not Found",
    path: "/400",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getErrorPage500 = (req, res, next) => {
  res
    .status(500)
    .render("500", {
      docTitle: "Server Error",
      path: "/500",
      isAuthenticated: req.session.isLoggedIn,
    });
};