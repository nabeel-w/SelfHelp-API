import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cron from 'node-cron';
import User from "./models/user.js";
import sanatize from "./middleware/sanatize.js"
import authRoute from "./routes/authRoute.js"
import chatRoute from "./routes/chatRoute.js"

dotenv.config();
const app=express();
const PORT=process.env.PORT||5000;
const mongoLink=process.env.MONGODB_URI||"mongodb://127.0.0.1:27017";

app.use(cors());
app.use(sanatize);

try{
    mongoose.connect(mongoLink,{
        dbName: "helpDB",
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const db = mongoose.connection;
    db.once('open', () => {console.log('Connected to MongoDB!')});
    cron.schedule('*/1 * * * *', async () => {
        try {
            await User.deleteUnverifiedUsers();
            console.log('Scheduled cleanup completed.');
        } catch (error) {
            console.error('Error in scheduled cleanup:', error);
        }
    });
}catch(err){
    console.log("Connection to database failed",err);
}

app.use("/api/auth",authRoute);
app.use("/api/bot",chatRoute);


app.listen(PORT,()=>{
    console.log(`Server started at port ${PORT}`);
});