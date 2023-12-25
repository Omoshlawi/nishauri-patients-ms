import { Router } from "express";
import {
  getPrograms,
  createProgram,
  deleteProgram,
  updateProgram,
} from "./domain";

const router = Router();

router.get("/", getPrograms);
router.post("/", createProgram);
router.put("/:id", updateProgram);
router.delete("/:id", deleteProgram);

export default router;
