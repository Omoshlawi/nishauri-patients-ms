import { z } from "zod";

const ProgramSchema = z.object({
  name: z.string(),
  programCode: z.enum(["HIV", "TB", "HBP", "MNCH"]),
  isActive: z.boolean().optional(),
  description: z.string(),
});

export default ProgramSchema;
