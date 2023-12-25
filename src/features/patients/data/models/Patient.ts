import { Schema, model } from "mongoose";
import Person from "./Person";
import PatientIdentifier from "./PatientIdentifier";

const Patient = model(
  "Patient",
  new Schema({
    person: {
      type: Person.schema,
      required: true,
    },
    identifiers: {
      type: [PatientIdentifier.schema],
      default: [],
    },
  })
);
