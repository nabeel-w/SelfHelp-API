import { Schema, model } from "mongoose";


const validatePhoneNumber = (phoneNumber) => {
    if (/^\+91\d{10}$/.test(phoneNumber)) {
      return true;
    } else {
      return false;
    }
  };

const userSchema = new Schema({
    email:{
        type:String,
        unique:[true,'Email Already Exists'],
        required:[true,'Email is Required']
    },
    password:{
        type:String
    },
    phoneNumber:{
        type:String,
        unique:[true,'Phone Number Already Exists'],
        required:[true,'Phone Number is Required'],
        validate:{
            validator: validatePhoneNumber,
            message: "Invalid Number"
        }
    },
    image:{
        type:String
    },
    phoneVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

userSchema.statics.deleteUnverifiedUsers = async function () {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    await this.deleteMany({ phoneVerified: false, createdAt: { $lte: fiveMinutesAgo } });
};

export default model('User', userSchema);