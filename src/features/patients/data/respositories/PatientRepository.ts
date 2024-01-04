import { Types } from "mongoose";
import ServiceClient from "../../../../shared/ServiceClient";
import { Patient } from "../models";
import { omit } from "lodash";

const getPatientById = async (patientId: string | Types.ObjectId) => {};

const searchEMRPatient = async (mflCode: string, q: string) => {
  const { results }: { results: any[] } = await ServiceClient.callService(
    "nishauri-facilities-registry-ms",
    {
      method: "GET",
      url: `api/${mflCode}/patient`,
      params: { q, v: "full" },
    }
  );
  return results;
};

const getPatientProfileByUserId = async (userId: string, token: string) => {
  return await ServiceClient.callService("nishauri-users-ms", {
    url: `auth/user/${userId}`,
    method: "GET",
    headers: { "x-access-token": token },
  });
};
const extractIndentifiers = (identifiers: any[]) =>
  identifiers.map((identifier) => ({
    identifier: identifier.identifier,
    identifierType: identifier.identifierType.display,
  }));

const extractContacts = (
  attributes: any[]
): {
  "Telephone contact"?: string;
  "Email address"?: string;
  "Alternate Phone Number"?: string;
} => {
  const attrTypes = [
    "Telephone contact",
    "Email address",
    "Alternate Phone Number",
  ];
  return attributes.reduce((prev, current) => {
    if (attrTypes.includes(current.attributeType.display))
      return { ...prev, [current.attributeType.display]: current.value };
    return prev;
  }, {});
};

const savePatient = async (patient: any) => {
  if (patient._id) {
    // Update and return
    const _patient = await Patient.findByIdAndUpdate(
      patient._id,
      omit(patient, ["_id"]),
      { new: true }
    );
    return _patient;
  }
  // create and return
  const _patient = new Patient(patient);
  await _patient.save();
  return _patient;
};

export default {
  getPatientById,
  searchEMRPatient,
  getPatientProfileByUserId,
  patientEMRDataExtractor: {
    extractContacts,
    extractIndentifiers,
  },
  savePatient,
};
