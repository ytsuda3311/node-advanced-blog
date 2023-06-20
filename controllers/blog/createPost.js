const BlogModel = require("../../models/blog");

module.exports = async (req, res) => {
  try {
    // awaitで指定した関数の処理が完了するまで、async内の処理を一時停止する
    // create(書き込みたいデータ)
    const savedBlogData = await BlogModel.create(req.body);
    res.redirect("/");
  } catch (error) {
    res.render("error", { message: "/blog/createのエラー" });
  }
};
