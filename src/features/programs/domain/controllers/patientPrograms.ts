import { NextFunction, Request, Response } from "express";
import { UserRequest } from "../../../../shared/types";
import { patientProgramRepository } from "../../data/respositories";
import { Types } from "mongoose";
import { APIException } from "../../../../shared/exceptions";
import { PatientProgramRegistrationSchema } from "../../presentation";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id))
      throw { status: 404, errors: { detail: "Invalid patient" } };
    const validation = await PatientProgramRegistrationSchema.safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const response = await patientProgramRepository.registerForProgram(
      req.params.id,
      validation.data
    );
    return res.json(response);
  } catch (error) {
    console.log(error);

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
      throw { status: 404, errors: {detail: "Invalid patient"} };
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
