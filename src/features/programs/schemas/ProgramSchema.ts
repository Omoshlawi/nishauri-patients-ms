import { z } from "zod";

const ProgramSchema = z.object({
  name: z.string(),
  programCode: z.enum(["HIV", "TB", "HBP", "MNCH","CANCER"]),
  isActive: z.boolean().optional(),
  description: z.string(),
});

export default ProgramSchema;
