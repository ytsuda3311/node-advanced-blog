const BlogModel = require("../../models/blog");

module.exports = async (req, res) => {
  // awaitで指定した関数の処理が完了するまで、async内の処理を一時停止する
  // findById()でidのデータを取得
  const singleBlog = await BlogModel.findById(req.params.id);
  // render()でEJSファイルを表示
  res.render("blogRead", {
    singleBlog: singleBlog,
    session: req.session.userId,
  });
};
