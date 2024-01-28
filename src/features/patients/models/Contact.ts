import { Schema } from "mongoose";

const ContactSchema = new Schema({
  type: String,
  contact: String,
});

export default ContactSchema;
