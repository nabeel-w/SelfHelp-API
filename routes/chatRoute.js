import OpenAI from "openai";
import express from "express";
import bodyParser from "body-parser";
import Chat from "../models/chat.js";
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
    console.log(messages);
}

async function sendMessage(message,id) {
    getPreviousChats(id)
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: 'system',
                content: "You are Dr. SelfHelp you are a helper which can talk to people curious about their mental health and give initial diagnosis and direction on how they can try to improve their life you'll ask them question to assess their mental state and help them become more self aware of their problems"
            },
            {
                role:'user',
                content:message
            }
        ]
    });
    console.log(response.choices[0].message.content);
    const botResponse=response.choices[0].message.content;
    return botResponse;
}

// await sendMessage("Hi i'm nabeel , who are you?");
// await sendMessage("okay Dr. SelfHelp, who am I ");