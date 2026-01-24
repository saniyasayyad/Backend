import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit:"16kb"})) //diffrent format from url %20 datagram
app.use(express.static("public"))  // any other problem then insert local public folder
app.use(cookieParser());

// router import
import userRouter from './routes/user.routes.js'

// router declaration
app.use("/api/v1/users", userRouter)
export { app }