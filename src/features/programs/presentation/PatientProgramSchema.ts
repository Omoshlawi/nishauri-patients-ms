import { Types } from "mongoose";
import { z } from "zod";

const PatientProgramSchema = z.object({
  program: z
    .string()
    .refine((p) => Types.ObjectId.isValid(p), "Invalid program"),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  patient: z
    .string()
    .refine((p) => Types.ObjectId.isValid(p), "Invalid patient"),
});

export default PatientProgramSchema;
