import OpenAI from "openai";
import express from "express";
import bodyParser from "body-parser";
import Chat from "../models/chat.js";
import verifyToken from "../middleware/verifyToken.js";
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

const openai = new OpenAI({
    apiKey: process.env.GPT_API_KEY,
});

async function getPreviousChats(id){
    const userChats=await Chat.find({userId:id});
    const messages= userChats.map(chat=>{
        return {
            role:chat.chatBot?"assistant":"user",
            content:chat.message
        }
    })
    return messages;
}

async function sendMessage(message,id,res) {
    const prevMessages=await getPreviousChats(id)
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: 'system',
                content: "You are Dr. SelfHelp you are a helper which can talk to people curious about their mental health and give initial diagnosis and direction on how they can try to improve their life you'll ask them question to assess their mental state and help them become more self aware of their problems"
            },
            ...prevMessages,
            {
                role:'user',
                content:message
            }
        ]
    });
    //console.log(response.choices);
    if(response.choices[0].finish_reason!=='stop') return res.status(500).json({ err:"Invalid Chat Response " });
    const botResponse=response.choices[0].message.content;
    return botResponse;
}

router.post("/chat",verifyToken,async(req,res)=>{
    const message=req.body.userMessage;
    const { id } = req.decoded;
    await Chat.create({
        userId:id,
        chatBot:false,
        message:message
    });
    const chatRes= await sendMessage(message,id,res);
    await Chat.create({
        userId:id,
        message:chatRes
    });
    return res.status(200).json({ message: chatRes })
    //console.log(chatRes);
});

// await sendMessage("Hi i'm nabeel , who are you?");
// await sendMessage("okay Dr. SelfHelp, who am I ");

export default router;