import { Schema, model } from "mongoose";

const chatSchema= Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    chatBot:{
        type:Boolean,
        default: true
    },
    message:{
        type:String,
        reqired:[true,'Message is Required']
    },
    timestamp:{
        type:Date,
        default:Date.now
    }
})

export default model('Chat', chatSchema);