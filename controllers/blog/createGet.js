module.exports = (req, res) => {
  // ログインしている場合に表示
  if (req.session.userId) {
    // render()でEJSファイルを表示
    res.render("blogCreate");
  } else {
    res.redirect("/user/login");
  }
};
