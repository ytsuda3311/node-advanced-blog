const express = require("express"); // express読み込み
const app = express();
app.use(express.urlencoded({ extended: true })); // formから投稿されたデータの中身を解析
const mongoose = require("mongoose"); // mongoose読み込み
const session = require("express-session"); // express-session読み込み

app.set("view engine", "ejs"); // ejsをテンプレートエンジンとして設定
app.use("/public", express.static("public")); // 画像やCSSファイルを扱えるように設定

//* Session
app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 300000 },
  })
);

//* Connecting to MongoDB
mongoose
  .connect(
    "mongodb+srv://ytsuda3311:oyamadaijst001@cluster0.upzpezk.mongodb.net/blogUserDatabase?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Success: Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failure: Unconnected to MongoDB");
  });

//* Defining Schema and Model
// MongoDBにデータを保存するには、データの形と種類（Schema）を指定する必要がある
const Schema = mongoose.Schema;

// ブログデータ
const BlogSchema = new Schema({
  title: String,
  summary: String,
  image: String,
  textBody: String,
});

// ユーザーデータ
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // 同じメールアドレスは登録できない
  },
  password: {
    type: String,
    required: true,
  },
});

// CRUD操作を実行するためにModelを生成
// ブログモデル
const BlogModel = mongoose.model("Blog", BlogSchema);

// ユーザーモデル
const UserModel = mongoose.model("User", UserSchema);

//* BLOG function
//* Create blog
app.get("/blog/create", (req, res) => {
  // ログインしている場合に表示
  if (req.session.userId) {
    // render()でEJSファイルを表示
    res.render("blogCreate");
  } else {
    res.redirect("/user/login");
  }
});

app.post("/blog/create", async (req, res) => {
  try {
    // awaitで指定した関数の処理が完了するまで、async内の処理を一時停止する
    // create(書き込みたいデータ)
    const savedBlogData = await BlogModel.create(req.body);
    res.redirect("/");
  } catch (error) {
    res.render("error", { message: "/blog/createのエラー" });
  }
});

//* Read All Blogs
app.get("/", async (req, res) => {
  // JavaScriptは先に書いたコードの処理が終わってから次に進むわけではない
  // awaitで指定した関数の処理が完了するまで、async内の処理を一時停止する
  // find()で全てのデータを取得
  const allBlogs = await BlogModel.find();
  // render()でEJSファイルを表示
  res.render("index", { allBlogs: allBlogs, session: req.session.userId });
});

//* Read Single Blog
app.get("/blog/:id", async (req, res) => {
  // awaitで指定した関数の処理が完了するまで、async内の処理を一時停止する
  // findById()でidのデータを取得
  const singleBlog = await BlogModel.findById(req.params.id);
  // render()でEJSファイルを表示
  res.render("blogRead", {
    singleBlog: singleBlog,
    session: req.session.userId,
  });
});

//* Update Blog
// 編集画面を表示するGETリクエスト
app.get("/blog/update/:id", async (req, res) => {
  // awaitで指定した関数の処理が完了するまで、async内の処理を一時停止する
  const singleBlog = await BlogModel.findById(req.params.id);
  res.render("blogUpdate", { singleBlog });
});

// 変更を加えたデータを書き込むPOSTリクエスト
app.post("/blog/update/:id", async (req, res) => {
  try {
    // awaitで指定した関数の処理が完了するまで、async内の処理を一時停止する
    // updateOne(編集するドキュメント, 編集したデータの入ったドキュメント)
    await BlogModel.updateOne({ _id: req.params.id }, req.body);
    res.redirect("/");
  } catch (error) {
    res.render("error", { message: "/blog/updateのエラー" });
  }
});

//* Delete Blog
// 削除画面を表示するGETリクエスト
app.get("/blog/delete/:id", async (req, res) => {
  // awaitで指定した関数の処理が完了するまで、async内の処理を一時停止する
  const singleBlog = await BlogModel.findById(req.params.id);
  res.render("blogDelete", { singleBlog });
});

// 削除を実行するコード
app.post("/blog/delete/:id", async (req, res) => {
  try {
    // awaitで指定した関数の処理が完了するまで、async内の処理を一時停止する
    // deleteOne(削除するドキュメント)
    await BlogModel.deleteOne({ _id: req.params.id });
    res.redirect("/");
  } catch (error) {
    res.render("error", { message: "/blog/deleteのエラー" });
  }
});

//* User function
//* Create user
app.get("/user/create", (req, res) => {
  res.render("userCreate");
});

app.post("/user/create", async (req, res) => {
  try {
    const savedUserData = await UserModel.create(req.body);
    res.redirect("/user/login");
  } catch (error) {
    res.render("error", { message: "/user/createのエラー" });
  }
});

//* user Login
app.get("/user/login", (req, res) => {
  res.render("login");
});

app.post("/user/login", async (req, res) => {
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
});

//* Connecting to port
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
