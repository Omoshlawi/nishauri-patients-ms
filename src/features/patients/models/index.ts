import { model } from "mongoose";
import PatientSchema from "./Patient";

export const PatientModel = model("Patient", PatientSchema);
