import { Entity } from "../../../shared/types";

export interface Patient extends Entity {
  person: Person;
  indentifiers: PatientIdentifier[];
  contacts: Contact[];
}

export interface PatientIdentifier extends Entity {
  identifier: string;
  identifierType: string;
  mflCode: string;
}

export interface Person extends Entity {
  user: User;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: "U" | "F" | "M";
}
export interface User extends Entity {
  username: string;
  isActive: boolean;
}
export interface Contact extends Entity {
  type: string;
  contact: string;
}
