const mongoose = require("mongoose"); // mongoose読み込み

// MongoDBにデータを保存するには、データの形と種類（Schema）を指定する必要がある
const Schema = mongoose.Schema;

// ブログデータ
const BlogSchema = new Schema({
  title: String,
  summary: String,
  image: String,
  textBody: String,
});

// CRUD操作を実行するためにModelを生成
// ブログモデル
const BlogModel = mongoose.model("Blog", BlogSchema);

module.exports = BlogModel;
