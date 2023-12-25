import { NextFunction, Request, Response } from "express";
import { programsRepository } from "../../data/respositories";
import { ProgramSchema } from "../../presentation";
import { APIException } from "../../../../shared/exceprions";

export const getPrograms = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const programs = await programsRepository.getActivePrograms();
    return res.json({ results: programs });
  } catch (error) {
    next(error);
  }
};

export const createProgram = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await ProgramSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const program = await programsRepository.createProgram(validation.data);
    return res.json(program);
  } catch (error) {
    next(error);
  }
};
export const updateProgram = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await ProgramSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const program = await programsRepository.updateProgram(
      validation.data,
      req.params.id
    );
    console.log(program);

    return res.json(program);
  } catch (error) {
    next(error);
  }
};
export const deleteProgram = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const program = await programsRepository.deleteProgram(req.params.id);
    return res.json(program);
  } catch (error) {
    next(error);
  }
};
