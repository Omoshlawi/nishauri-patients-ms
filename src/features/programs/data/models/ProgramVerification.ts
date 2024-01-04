import { Schema, model } from "mongoose";
import { generateExpiryTime, generateOTP } from "../../../../utils/helpers";
import moment from "moment/moment";

const ProgramVerification = model(
  "ProgramVerification",
  new Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
      },
      otp: {
        type: String,
        default: () => generateOTP(5),
      },
      expiry: {
        type: Date,
        default: () => generateExpiryTime(5),
      },
      verified: {
        type: Boolean,
        default: false,
      },
      extra: {
        type: String,
        maxlength: 255,
      },
    },
    {
      statics: {
        async getOrCreate({ patient, extra }) {
          let verification = await this.findOne({
            patient,
            verified: false,
            expiry: {
              $gte: moment(),
            },
          });
          if (!verification) {
            verification = new this({ patient, extra });
            await verification.save();
          }
          return verification;
        },
      },
      timestamps: true,
    }
  )
);

export default ProgramVerification;
