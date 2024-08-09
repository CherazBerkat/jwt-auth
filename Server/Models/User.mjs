import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: false,
  },
  email: {
    type: String,
    unique: false,
  },
  password: {
    type: String,
    unique: false,
  },
  facebook: {
    type: String,
    unique: false,
  },
  instagram: {
    type: String,
    unique: false,
  },
  github: {
    type: String,
    unique: false,
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
