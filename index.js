const express = require("express"); // express読み込み
const app = express();
app.use(express.urlencoded({ extended: true })); // formから投稿されたデータの中身を解析
const mongoose = require("mongoose"); // mongoose読み込み
const session = require("express-session"); // express-session読み込み
const routers = require("./routes"); // routes読み込み

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

app.use(routers);

//* Page Notfound
app.get("*", (req, res) => {
  res.render("error", { message: "ページが存在しません" });
});

//* Connecting to port
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
