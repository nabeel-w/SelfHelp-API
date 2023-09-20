import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import jwt from 'jsonwebtoken';
import twilio from 'twilio';
import verifyToken from "../middleware/verifyToken.js";
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const secretKey = process.env.JWT_SECRET;

router.use(bodyParser.urlencoded({ extended: true }));

async function generateOTP(id, phoneNumber, res) {
    let otp = String(Math.floor(100000 + Math.random() * 900000));
    const salt = await bcrypt.genSalt(10);
    const OTP = await bcrypt.hash(otp, salt);
    const token = jwt.sign({ id, OTP }, secretKey, { expiresIn: '5m' });
    client.messages.create({
        body: `Your verification code is: ${otp}`,
        to: phoneNumber,
        messagingServiceSid: process.env.MESSAGING_SERVICE_SID
    }).then(() => {
        return res.status(200).json({ token });
    })
}




router.post("/signup", async (req, res) => {
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;
    const conditions = [
        { email: email },
        { phoneNumber: phoneNumber }
    ];

    const userFound = await User.findOne({ $or: conditions });
    if (userFound) {
        return res.status(409).json({ message: "This email or phone number is already in use." });
    }
    else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({
            email: email,
            phoneNumber: phoneNumber,
            password: hashedPassword
        });
        await user.save();
        generateOTP(user._id, user.phoneNumber, res);
    }
});

router.post("/login", async (req, res) => {
    const userInfo = req.body.phoneNumber || req.body.email;
    const conditions = [
        { email: userInfo },
        { phoneNumber: userInfo }
    ];
    const userFound = await User.findOne({ $or: conditions });
    if (!userFound) {
        return res.status(404).json({ message: "User doesn't exist" });
    }
    else {
        const success =await bcrypt.compare(password, userFound.password);
        if (!success) {
            return res.status(401).json({ message: "Wrong credentials" });
        }
        else {
            const id = userFound._id;
            const expiration = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);//Token expires in one week
            const token = jwt.sign({ id }, secretKey, { expiresIn: expiration });
            return res.status(200).json({ token });
        }
    }
});

router.post("/verifyOTP", verifyToken, async (req, res) => {
    const inputOTP = req.body.otp||"";
    const { id, OTP } = req.decoded;
    const expiration = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);//Token expires in one week
    const token = jwt.sign({ id }, secretKey, { expiresIn: expiration });

    const success =await bcrypt.compare(inputOTP, OTP);
    if (!success){
        return res.status(401).json({ err: "Invalid OTP" })
    }
    else{
        await User.updateOne({ _id:id },{ phoneVerified:true });
        return res.status(200).json({ token })
    }
        
})

export default router;