import { model } from "mongoose";
import PatientSchema from "./Patient";

export const Patient = model("Patient", PatientSchema);
