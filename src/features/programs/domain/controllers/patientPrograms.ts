import { NextFunction, Request, Response } from "express";
import { UserRequest } from "../../../../shared/types";
import {
  patientProgramRepository,
  programsRepository,
} from "../../data/respositories";
import { Types } from "mongoose";
import { APIException } from "../../../../shared/exceptions";
import { PatientProgramRegistrationSchema } from "../../presentation";
import config from "config";
import { parseMessage } from "../../../../utils/helpers";
import { patientsRepository } from "../../../patients/data/respositories";

export const requestVerificationCode = async (
  req: UserRequest,
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

    const { otp: code } =
      await patientProgramRepository.getOrCreateAccountVerification(
        req.user._id,
        mode
      );

    // Send sms to patient
    const smsTemplate: string = config.get("sms.PROGRAM_OTP_SMS");
    const sms = parseMessage({ code }, smsTemplate);

    // await sendSms(sms, "0793889658");
    return res.json({
      detail: `OTP sent to ${mode} successfully`,
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
    //  a.validate param id
    if (!Types.ObjectId.isValid(req.params.id))
      throw { status: 404, errors: { detail: "Invalid patient" } };
    const validation = await PatientProgramRegistrationSchema.safeParseAsync(
      req.body
    );
    // b.Validated body
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    // Validate if user is registered to progam
    if (
      await patientProgramRepository.userRegisteredToProgram(
        req.params.id,
        validation.data.mflCode
      )
    )
      throw new APIException(400, {
        programCode: {
          _errors: ["You are already registered to this program"],
        },
      });
    // --------------2. Get EMR Patient and save
    // a.GET Patient from EMR, throws excepion if no match
    const patient = await patientProgramRepository.getEMRPatient(
      validation.data
    );
    // b.Extract patient identifiers
    const identifiers =
      patientsRepository.patientEMRDataExtractor.extractIndentifiers(
        patient.identifiers
      );
    // c.Get profile from users ms
    const profile = await patientsRepository.getPatientProfileByUserId(
      req.params.id,
      req.header("x-access-token") as string
    );
    // d.Create local paient object
    let _patient: any = {
      identifiers,
      person: { ...profile.person[0], user: profile },
    };
    // e.Persist patient to db id not exist otherwise update in background
    patientsRepository.savePatient(_patient);
    

    // Extract contacts from patient attributes
    const contacts = patientsRepository.patientEMRDataExtractor.extractContacts(
      patient.person.attributes
    );
    //

    return res.json(_patient);
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
    return res.json(
      await patientProgramRepository.getPatientPrograms(req.params.id)
    );
  } catch (error) {
    next(error);
  }
};
export const verifyProgramRegistration = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};
