import { Schema, model } from "mongoose";

const PatientIdentifierSchema = new Schema({
  identifier: {
    type: String,
    required: true,
  },
  identifierType: {
    type: String,
    required: true,
  },
  mflCode: {
    type: String,
    required: true,
  },
});

export default PatientIdentifierSchema;
