import { Schema, model } from "mongoose";
import User from "./User";
import UserSchema from "./User";

const PersonSchema = new Schema({
  user: {
    type: UserSchema,
    required: true,
  },
  firstName: {
    type: String,
    default: null,
  },
  lastName: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    default: null,
  },
  gender: {
    type: String,
    enum: ["U", "F", "M"],
    default: "U",
  },
});

export default PersonSchema;
