import { Schema, model } from "mongoose";

const PatientIdentifier = model(
  "PatientIdentifier",
  new Schema({
    identifier: {
      type: String,
      required: true,
      unique: true,
    },
    identifierType: {
      type: String,
      required: true,
    },
    mflCode: {
      type: String,
      required: true,
    },
  })
);

export default PatientIdentifier;
