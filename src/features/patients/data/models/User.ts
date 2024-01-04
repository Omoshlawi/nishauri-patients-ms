import { model, Schema } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    maxlength: 30,
    minlength: 4,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export default UserSchema;
