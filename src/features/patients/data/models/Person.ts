import { Schema, model } from "mongoose";
import User from "./User";

const Person = model(
  "Person",
  new Schema({
    user: {
      type: User.schema,
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
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
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
  })
);

export default Person;
