const UserModel = require("../../models/user");

module.exports = async (req, res) => {
  try {
    // 入力されたユーザーの情報がDBにあるのか確認（emailで判定）
    const savedUserData = await UserModel.findOne({ email: req.body.email });
    if (savedUserData) {
      // ユーザーが存在した場合の処理
      // 入力されたパスワードが正しいか確認
      if (req.body.password === savedUserData.password) {
        // パスワードが正しい場合の処理
        req.session.userId = savedUserData._id;
        res.redirect("/");
      } else {
        // パスワードが間違っている場合の処理
        res.render("error", {
          message: "/user/loginのエラー: パスワードが間違っています",
        });
      }
    } else {
      // ユーザーが存在していない場合の処理
      res.render("error", {
        message: "/user/loginのエラー: ユーザーが存在していません",
      });
    }
  } catch (error) {
    res.render("error", { message: "/user/loginのエラー" });
  }
};
