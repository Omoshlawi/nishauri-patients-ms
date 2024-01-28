import { Types } from "mongoose";
import ServiceClient from "../../../shared/ServiceClient";
import { Patient } from "../models";
import { merge, omit, pick } from "lodash";

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
const extractIndentifiers = (mflCode: string, identifiers: any[]) =>
  identifiers.map((identifier) => ({
    identifier: identifier.identifier,
    identifierType: identifier.identifierType.display,
    mflCode,
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

const savePatient = async (
  patient: any,
  mode: "update" | "override"
): Promise<any> => {
  let _patient;

  try {
    if (await Patient.findOne({ "person._id": patient.person._id })) {
      if (mode === "update") {
        _patient = await updatePatient(patient);
      } else {
        _patient = await Patient.findByIdAndUpdate(
          patient._id,
          omit(patient, ["_id"]),
          { new: true }
        );
      }
    } else {
      _patient = new Patient(patient);
      await _patient.save();
    }

    return _patient;
  } catch (error) {
    // Handle and log the error
    console.error("Error in savePatient:", error);
    throw error;
  }
};

const updatePatient = async (patient: any) => {
  const pat = await Patient.findOne({ "person._id": patient.person._id });
  const currIds = pat?.identifiers ?? [];
  const newIds: {
    identifier: string;
    identifierType: string;
    mflCode: string;
  }[] = patient?.identifiers ?? [];

  // Update existing identifiers and add new ones
  const updatedIdentifiers = newIds.map((newId) => {
    const existingId = currIds.find(
      (currId) =>
        currId.mflCode === newId.mflCode &&
        currId.identifierType === newId.identifierType
    );

    if (existingId) {
      // If the identifier exists, update its fields
      return {
        ...pick(existingId, ["_id", "identifier", "identifierType", "mflCode"]),
        ...newId,
      };
    } else {
      // If the identifier doesn't exist, add it to the list
      return newId;
    }
  });
  // Merge the patient object with the updated identifiers
  return await Patient.findOneAndUpdate(
    { "person._id": patient.person._id },
    merge(omit(patient, ["_id", "identifiers"]), {
      identifiers: updatedIdentifiers,
    }),
    { new: true }
  );
};

const getPatientByUserId = async (userId: string) => {
  return await Patient.findOne({ "person.user._id": userId });
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
  updatePatient,
  getPatientByUserId,
};
