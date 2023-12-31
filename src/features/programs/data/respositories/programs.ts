import { z } from "zod";
import { Program } from "../models";
import { ProgramSchema } from "../../presentation";
import { isEmpty } from "lodash";
import { Types } from "mongoose";

const getActivePrograms = async () => {
  return await Program.find({ isActive: true });
};

const createProgram = async (data: z.infer<typeof ProgramSchema>) => {
  /**
   * Ensure no other program with same name
   * Ensure no other program with same code
   * create program
   * return program
   */
  const errors: any = {};
  const { name, programCode } = data;
  if (await Program.findOne({ name }))
    errors["name"] = { _errors: ["Name taken"] };
  if (await Program.findOne({ programCode }))
    errors["programCode"] = { _errors: ["ProgramCode taken"] };

  if (!isEmpty(errors)) throw { status: 400, errors };

  const program = new Program(data);
  await program.save();

  return program;
};

const updateProgram = async (
  data: z.infer<typeof ProgramSchema>,
  programId: string | Types.ObjectId
) => {
  if (!Types.ObjectId.isValid(programId))
    throw { status: 404, errors: "Program not found" };
  /**
   * Ensure no other program with same name
   * Ensure no other program with same code
   * create program
   * return program
   */

  const errors: any = {};
  const { name, programCode } = data;
  let _program = await Program.findOne({ name });
  if (_program && !_program._id.equals(programId))
    errors["name"] = { _errors: ["Name taken"] };
  _program = await Program.findOne({ programCode });
  if (_program && !_program._id.equals(programId))
    errors["programCode"] = { _errors: ["ProgramCode taken"] };

  if (!isEmpty(errors)) throw { status: 400, errors };

  const program = await Program.findByIdAndUpdate(programId, data, {
    new: true,
  });
  return program;
};

const deleteProgram = async (programId: string | Types.ObjectId) => {
  const errors = { status: 404, errors: "Program not found" };
  if (!Types.ObjectId.isValid(programId)) throw errors;
  const program = await Program.findById(programId);
  if (!program) throw errors;
  await program.deleteOne();
  return program;
};

export default {
  getActivePrograms,
  createProgram,
  updateProgram,
  deleteProgram,
};
