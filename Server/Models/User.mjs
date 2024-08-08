import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    default: null,
    unique: true,
  },
  password: {
    type: String,
    default: null,
  },
  facebook: {
    type: String,
    default: null,
    unique: true,
  },
  instagram: {
    type: String,
    default: null,
    unique: true,
  },
  github: {
    type: String,
    default: null,
    unique: true,
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
