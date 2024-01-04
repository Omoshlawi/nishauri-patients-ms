import { z } from "zod";

const ProgramVerificationSchema = z.object({
  otp: z.string().length(5),
  mode: z.string().optional(),
  programCode: z.string(),
});

export default ProgramVerificationSchema;
