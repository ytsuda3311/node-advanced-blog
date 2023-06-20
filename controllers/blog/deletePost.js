const BlogModel = require("../../models/blog");

// 削除を実行するコード
module.exports = async (req, res) => {
  try {
    // awaitで指定した関数の処理が完了するまで、async内の処理を一時停止する
    // deleteOne(削除するドキュメント)
    await BlogModel.deleteOne({ _id: req.params.id });
    res.redirect("/");
  } catch (error) {
    res.render("error", { message: "/blog/deleteのエラー" });
  }
};
