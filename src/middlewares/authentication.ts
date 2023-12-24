import config from "config";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRequest } from "../shared/types";

const authenticate = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {};

export default authenticate;
