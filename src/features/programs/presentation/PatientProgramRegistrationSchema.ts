import { z } from "zod";

const PatientProgramRegistrationSchema = z.object({
  programCode: z.enum(["HIV", "TB", "HBP", "MNCH", "CANCER"]),
  uniquePatientProgramId: z.coerce
    .number()
    .refine((no) => no.toString().length === 10, "must be 10 characters long"),
  firstName: z.string().max(50),
  mflCode: z.string(),
});
export default PatientProgramRegistrationSchema;
