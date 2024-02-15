import { NextFunction, Request, Response } from "express";
import { UserRequest } from "../../../shared/types";
import { patientProgramRepository, programsRepository } from "../repositories";
import { Types } from "mongoose";
import {
  PatientProgramRegistrationSchema,
  ProgramVerificationSchema,
} from "../schemas";
import config from "config";
import { parseMessage, sendSms } from "../../../utils/helpers";
import { patientsRepository } from "../../patients/repositories";
import { APIException } from "../../../shared/exceprions";

export const requestVerificationCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const modes = ["sms", "watsapp", "email"];
    const mode: "sms" | "watsapp" | "email" = modes.includes(
      req.query.mode as any
    )
      ? (req.query.mode as any)
      : "sms";
    if (!Types.ObjectId.isValid(req.params.id))
      throw { status: 404, errors: { detail: "Patient not found" } };
    const patient = await patientsRepository.getPatientByUserId(req.params.id);

    if (!patient)
      throw { status: 404, errors: { detail: "Patient not found" } };
    const { otp: code } =
      await patientProgramRepository.getOrCreateProgramVerification(
        patient._id,
        mode
      );

    // Send sms to patient
    const smsTemplate: string = config.get("sms.PROGRAM_OTP_SMS");
    const sms = parseMessage({ code }, smsTemplate);

    await sendSms(sms, "0793889658");
    return res.json({
      detail: `OTP sent to ${mode} 0793889658 successfully`,
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //----------------1.Validation
    //  a.validate param id id is valid Object id(userId) ✅
    if (!Types.ObjectId.isValid(req.params.id))
      throw { status: 404, errors: { detail: "Patient not found" } };
    const validation = await PatientProgramRegistrationSchema.safeParseAsync(
      req.body
    );
    // b.Validated body ✅
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    // Validate if user is registered to progam ✅
    if (
      await patientProgramRepository.userRegisteredToProgram(
        req.params.id,
        validation.data.programCode
      )
    )
      throw new APIException(400, {
        programCode: {
          _errors: ["You are already registered to this program"],
        },
      });
    // --------------2. Get EMR Patient and save ✅
    // a.GET Patient from EMR, throws excepion if no match
    const patient = await patientProgramRepository.getEMRPatient(
      validation.data
    );
    // b.Extract patient identifiers ✅
    const identifiers = patientsRepository.extractIndentifiers(
      validation.data.mflCode,
      patient.identifiers
    );
    // c.Get profile from users ms using user Id ✅
    const profile = await patientsRepository.getPatientProfileByUserId(
      req.params.id,
      req.header("x-access-token") as string
    );

    // d.Extract contacts from patient attributes ✅
    const contacts = patientsRepository.extractContacts(
      patient.person.attributes
    );
    // e.Create local paient object ✅
    let _patient: any = {
      identifiers,
      person: { ...profile.person[0], user: profile },
      contact: Object.entries(contacts).map(([type, contact]) => ({
        type,
        contact,
      })),
    };

    // f.Persist patient to db by creating new if don't already exist otherwise update
    _patient = await patientsRepository.savePatient(_patient, "update");

    // -------------3. Create User program with active false if not exists

    // b. Create program
    await patientProgramRepository.createPatientProgram(
      _patient._id,
      validation.data.programCode
    );
    // 4.
    //

    return res.json({
      programCode: validation.data.programCode,
      message: "Choose where otp is sent",
      contacts: _patient.contact,
    });
  } catch (error) {
    next(error);
  }
};
export const getRegisteredPrograms = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id))
      throw { status: 404, errors: { detail: "Invalid patient" } };
    const patient = await patientsRepository.getPatientByUserId(req.params.id);

    if (!patient)
      throw { status: 404, errors: { detail: "Patient not found" } };
    return res.json({
      reuslts: await patientProgramRepository.getPatientPrograms(patient._id),
    });
  } catch (error) {
    next(error);
  }
};
export const verifyProgramRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id))
      throw { status: 404, errors: { detail: "Invalid patient" } };
    const verification = await ProgramVerificationSchema.safeParseAsync(
      req.body
    );
    if (!verification.success)
      throw new APIException(400, verification.error.format());

    const patient = await patientsRepository.getPatientByUserId(req.params.id);

    if (!patient)
      throw { status: 404, errors: { detail: "Patient not found" } };

    await patientProgramRepository.verifyProgramRegistration(
      patient._id,
      verification.data
    );
    return res.json({
      detail: "Verification successfull!",
    });
  } catch (error) {
    next(error);
  }
};
