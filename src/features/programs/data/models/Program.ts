import { Schema, model } from "mongoose";

const Program = model(
  "Program",
  new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      programCode: {
        type: String,
        unique: true,
        required: true,
      },
      description: String,
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    { timestamps: true }
  )
);

export default Program;
