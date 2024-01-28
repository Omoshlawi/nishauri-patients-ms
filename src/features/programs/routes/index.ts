import { Router } from "express";
import {
  getPrograms,
  createProgram,
  deleteProgram,
  updateProgram,
  getRegisteredPrograms,
  register,
  verifyProgramRegistration,
  requestVerificationCode,
} from "../controllers";

const router = Router();

router.get("/patient-programs/:id", getRegisteredPrograms);
router.post("/patient-programs/:id", register);
router.get("/patient-programs/:id/verify", requestVerificationCode);
router.post("/patient-programs/:id/verify", verifyProgramRegistration);

router.get("/", getPrograms);
router.post("/", createProgram);
router.put("/:id", updateProgram);
router.delete("/:id", deleteProgram);

export default router;
