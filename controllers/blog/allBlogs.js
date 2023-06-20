const BlogModel = require("../../models/blog");

module.exports = async (req, res) => {
  // JavaScriptは先に書いたコードの処理が終わってから次に進むわけではない
  // awaitで指定した関数の処理が完了するまで、async内の処理を一時停止する
  // find()で全てのデータを取得
  const allBlogs = await BlogModel.find();
  // render()でEJSファイルを表示
  res.render("index", { allBlogs: allBlogs, session: req.session.userId });
};
