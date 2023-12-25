import { Schema, Types, model } from "mongoose";

const PatientProgram = model(
  "UserProgram",
  new Schema(
    {
      program: {
        type: Types.ObjectId,
        ref: "Program",
        required: true,
      },
      description: String,
      isActive: {
        type: Boolean,
        default: true,
      },
      patient: {
        type: Types.ObjectId,
        ref: "Patient",
        required: true,
      },
    },
    { timestamps: true }
  )
);

export default PatientProgram;
