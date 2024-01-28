import { Schema, model } from "mongoose";
import Person from "./Person";
import PatientIdentifier from "./PatientIdentifier";
import ContactSchema from "./Contact";
import PatientIdentifierSchema from "./PatientIdentifier";
import PersonSchema from "./Person";

const PatientSchema = new Schema({
  person: {
    type: PersonSchema,
    required: true,
  },
  identifiers: {
    type: [PatientIdentifierSchema],
    default: [],
  },
  contact: {
    type: [ContactSchema],
    default: [],
  },
});

export default PatientSchema;
