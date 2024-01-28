import { Types } from "mongoose";
import ServiceClient from "../../../shared/ServiceClient";
import { PatientModel } from "../models";
import { merge, omit, pick } from "lodash";
import { Repository } from "../../../shared/types";
import { Patient } from "../entities";

class PatientsRepository implements Repository<Patient> {
  create(entity: Patient): Promise<Patient> {
    throw new Error("Method not implemented.");
  }
  findOneById(id: string): Promise<Patient | undefined> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<Patient[]> {
    throw new Error("Method not implemented.");
  }
  findByCriteria(criteria: Record<string, any>): Promise<Patient[]> {
    throw new Error("Method not implemented.");
  }
  updateById(
    id: string,
    updates: Partial<Patient>
  ): Promise<Patient | undefined> {
    throw new Error("Method not implemented.");
  }
  deleteById(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  extractIndentifiers(mflCode: string, identifiers: any[]) {
    identifiers.map((identifier) => ({
      identifier: identifier.identifier,
      identifierType: identifier.identifierType.display,
      mflCode,
    }));
  }
  async searchEMRPatient(mflCode: string, q: string) {
    const { results }: { results: any[] } = await ServiceClient.callService(
      "nishauri-facilities-registry-ms",
      {
        method: "GET",
        url: `api/${mflCode}/patient`,
        params: { q, v: "full" },
      }
    );
    return results;
  }
  async getPatientProfileByUserId(userId: string, token: string) {
    return await ServiceClient.callService("nishauri-users-ms", {
      url: `auth/user/${userId}`,
      method: "GET",
      headers: { "x-access-token": token },
    });
  }
  extractContacts(attributes: any[]): {
    "Telephone contact"?: string;
    "Email address"?: string;
    "Alternate Phone Number"?: string;
  } {
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
  }
  async getPatientByUserId(userId: string) {
    return await PatientModel.findOne({ "person.user._id": userId });
  }

  async savePatient(patient: any, mode: "update" | "override"): Promise<any> {
    let _patient;

    try {
      if (await PatientModel.findOne({ "person._id": patient.person._id })) {
        if (mode === "update") {
          _patient = await this.updatePatient(patient);
        } else {
          _patient = await PatientModel.findByIdAndUpdate(
            patient._id,
            omit(patient, ["_id"]),
            { new: true }
          );
        }
      } else {
        _patient = new PatientModel(patient);
        await _patient.save();
      }

      return _patient;
    } catch (error) {
      // Handle and log the error
      console.error("Error in savePatient:", error);
      throw error;
    }
  }
  async updatePatient(patient: any) {
    const pat = await PatientModel.findOne({
      "person._id": patient.person._id,
    });
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
          ...pick(existingId, [
            "_id",
            "identifier",
            "identifierType",
            "mflCode",
          ]),
          ...newId,
        };
      } else {
        // If the identifier doesn't exist, add it to the list
        return newId;
      }
    });
    // Merge the patient object with the updated identifiers
    return await PatientModel.findOneAndUpdate(
      { "person._id": patient.person._id },
      merge(omit(patient, ["_id", "identifiers"]), {
        identifiers: updatedIdentifiers,
      }),
      { new: true }
    );
  }
}

export default PatientsRepository;
