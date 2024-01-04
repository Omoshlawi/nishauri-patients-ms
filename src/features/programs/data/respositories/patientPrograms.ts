import { z } from "zod";
import { PatientProgram, ProgramVerification } from "../models";
import { PatientProgramRegistrationSchema } from "../../presentation";
import { Patient } from "../../../patients/data/models";
import { Types } from "mongoose";
import { patientsRepository } from "../../../patients/data/respositories";

const _getProgramUniqueFieldName = (programCode: "HIV" | "TB") => {
  const MAPPING: { [key: string]: string } = {
    HIV: "Patient Clinic Number",
    "Child Welfare Clinic": "cwcNumber",
  };
  return MAPPING[programCode];
};

const userRegisteredToProgram = async (userId: string, programCode: string) => {
  const patient = await Patient.findOne({ "person.user._id": userId });
  if (!patient) return false;
  if (
    !(await PatientProgram.findOne({
      patient: patient._id,
      programCode,
      isActive: true,
    }))
  )
    return false;
  return true;
};

const getPatientPrograms = async (patientId: any) => {
  return await PatientProgram.find({ patient: patientId });
};

const getEMRPatient = async ({
  firstName,
  mflCode,
  programCode,
  uniquePatientProgramId,
}: z.infer<typeof PatientProgramRegistrationSchema>) => {
  // Search patient in emr
  const results = await patientsRepository.searchEMRPatient(
    mflCode,
    uniquePatientProgramId
  );
  // cross check info with emr data
  const patient = results.find((pat) => {
    const identifier = pat.identifiers.find(
      (id: any) =>
        id.identifierType.display ===
          _getProgramUniqueFieldName(programCode as any) &&
        id.identifier === uniquePatientProgramId
    );
    const hasFname = pat.person.preferredName.givenName === firstName;
    return Boolean(identifier) && hasFname;
  });
  if (!patient)
    throw {
      status: 404,
      errors: { detail: "No patient match found" },
    };
  return patient;
};

const registerForProgram = async (
  userId: string,
  data: z.infer<typeof PatientProgramRegistrationSchema>
) => {
  /**
   * @todo Add caching to facilities to reduce the network cals to validate mfl code
   */
  const { programCode, mflCode, uniquePatientProgramId, firstName } = data;

  // Save patient and sync with users ms persn in background

  //TODO Replace phone number with emr contact from to send otp
  // await sendSms(sms, "0793889658");
};
const verifyProgramRegistration = async (patientId: any) => {};

const getOrCreateAccountVerification = async (
  userId: string | Types.ObjectId,
  mode: "sms" | "watsapp" | "email"
) => {
  // Generate OTP
  const verification = await ProgramVerification.getOrCreate({
    patient: userId,
    extra: mode,
  });
  return verification;
};

const createPatientProgram = async (
  patientId: Types.ObjectId,
  programCode: string
) => {
  let program = await PatientProgram.findOne({
    patient: patientId,
    programCode,
  });
  if (program) return program;
  program = new PatientProgram({ patient: patientId, programCode });
  await program.save();
  return program;
};

export default {
  getPatientPrograms,
  registerForProgram,
  verifyProgramRegistration,
  userRegisteredToProgram,
  getEMRPatient,
  getOrCreateAccountVerification,
  createPatientProgram,
};
