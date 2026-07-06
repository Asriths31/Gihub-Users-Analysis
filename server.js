import { configDotenv } from "dotenv";
import express from "express";
import { routes } from "./routes.js";

configDotenv()
const app= express()

app.use("/api",routes)

const port=process.env.PORT

app.listen(port,()=>console.log("Server Started At",port))