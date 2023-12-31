import { NextFunction, Response } from "express";
import { UserRequest } from "../../../../shared/types";

export const register = async (
  params: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};
export const getRegisteredPrograms = async (
  params: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};
export const verifyProgramRegistration = async (
  params: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};
