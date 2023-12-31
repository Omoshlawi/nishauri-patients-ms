import { z } from "zod";

const PatientProgramRegistrationSchema = z.object({
  programCode: z.enum(["HIV", "TB", "HBP", "MNCH", "CANCER"]),
  uniquePatientProgramId: z.coerce.number().min(10).max(10),
  firstName: z.string().max(50),
  mflCode: z.string(),
});
export default PatientProgramRegistrationSchema;
