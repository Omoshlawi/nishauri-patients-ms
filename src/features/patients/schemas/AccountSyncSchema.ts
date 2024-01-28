import { z } from "zod";

const AccountSyncSchema = z.object({
    person: z.string(),
    mflCode: z.string(),
})