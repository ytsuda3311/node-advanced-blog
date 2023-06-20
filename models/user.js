const mongoose = require("mongoose"); // mongoose読み込み

// MongoDBにデータを保存するには、データの形と種類（Schema）を指定する必要がある
const Schema = mongoose.Schema;

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

// ユーザーモデル
const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
