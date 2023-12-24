import { Request } from "express";

export interface UserRequest extends Request {
  user: any; // Adjust the type as needed
}
