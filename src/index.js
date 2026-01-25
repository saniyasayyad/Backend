// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
import connectionDataBase from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectionDataBase()
  // after database connection there is  then and catch
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(` server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB CONNECTION ERROR !!!", err);
  });

/* import express from "express";
const app = express();

(async () => {
  try{
    // connect
    mongoose.connect(`$(process.env.MONGODB_URI)/$()`);
    app.on("error", () => {
      console.log("APP is not Connecting", error);
      throw error
    })

    app.listen(process.env.PORT, () => {
      console.log(`App is listening on Port ${process.env.PORT}`);
    })

  }catch(error) {
    console.log("This is the error", error);
    throw error;
  }
})() */
