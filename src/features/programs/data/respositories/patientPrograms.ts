import { z } from "zod";
import { PatientProgram } from "../models";
import { PatientProgramRegistrationSchema } from "../../presentation";
import ServiceClient from "../../../../shared/ServiceClient";
import { isEmpty } from "lodash";

const getPatientPrograms = async (patientId: any) => {
  return await PatientProgram.find({ patient: patientId });
};

const registerForProgram = async (
  patientId: string,
  data: z.infer<typeof PatientProgramRegistrationSchema>
) => {
  /**
   * Assertain patient is not yet registered to the program
   * Assertain facility with mflCode is registered
   * Gets patient from facility
   * @todo Add caching to facilities to reduce the network cals to validate mfl code
   */
  const errors: any = {};
  const { programCode, mflCode, uniquePatientProgramId, firstName } = data;
  if (await PatientProgram.find({ patient: patientId, programCode }))
    errors["programCode"] = {
      _errors: ["You are already registered to this program"],
    };

  const { results }: { results: any[] } = await ServiceClient.callService(
    "nishauri-facilities-registry-ms",
    {
      method: "GET",
      url: "facilities",
      params: { search: mflCode },
    }
  );
  const index = results.findIndex(({ mflCode: mf }) => mf === mflCode);
  if (index === -1)
    errors["mflCode"] = {
      _errors: ["Invalid facility or Facility not registered with nishauri"],
    };

  const patient = await ServiceClient.callService(
    "nishauri-facilities-registry-ms",
    {
      method: "GET",
      url: `api/${mflCode}/patients`,
      params: { q: mflCode, v: "full" },
    }
  );

  if (!isEmpty(errors))
    throw {
      status: 400,
      errors,
    };
  return patient;
};
const verifyProgramRegistration = async (patientId: any) => {};

export default {
  getPatientPrograms,
  registerForProgram,
  verifyProgramRegistration,
};
