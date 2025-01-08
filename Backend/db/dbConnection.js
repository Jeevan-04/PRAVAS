import mongoose from "mongoose";

export default function connectDB()
{
    mongoose.connect("mongodb://localhost:27017/pravas", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(()=>{
        console.log("Database Up and Running")
    })
    .catch((err)=>{
        console.log(err)
    })
}