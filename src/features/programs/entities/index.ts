import { Entity } from "../../../shared/types";
import { Patient } from "../../patients/entities";

export interface UserProgram extends Entity {
  programeCode: string;
  isActive: boolean;
  patient: Patient;
}
export interface Program extends Entity {
  name: string;
  programCode: string;
  description?: string;
  isActive: boolean;
}
export interface ProgramVerification extends Entity {
  patient: Patient;
  otp: string;
  expiry: string;
  verified: boolean;
  extra?: string;
}
