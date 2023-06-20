const BlogModel = require("../../models/blog");

// 編集画面を表示するGETリクエスト
module.exports = async (req, res) => {
  // awaitで指定した関数の処理が完了するまで、async内の処理を一時停止する
  const singleBlog = await BlogModel.findById(req.params.id);
  res.render("blogUpdate", { singleBlog });
};
