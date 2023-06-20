const BlogModel = require("../../models/blog");

// 変更を加えたデータを書き込むPOSTリクエスト
module.exports = async (req, res) => {
  try {
    // awaitで指定した関数の処理が完了するまで、async内の処理を一時停止する
    // updateOne(編集するドキュメント, 編集したデータの入ったドキュメント)
    await BlogModel.updateOne({ _id: req.params.id }, req.body);
    res.redirect("/");
  } catch (error) {
    res.render("error", { message: "/blog/updateのエラー" });
  }
};
