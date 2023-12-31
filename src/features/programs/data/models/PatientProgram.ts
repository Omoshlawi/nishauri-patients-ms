import { Schema, Types, model } from "mongoose";

const PatientProgram = model(
  "UserProgram",
  new Schema(
    {
      programCode: {
        type: String,
        required: true,
      },
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
