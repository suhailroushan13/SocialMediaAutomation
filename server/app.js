import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import config from "config"
import autoRouter from "./controllers/index.js"
const PORT = config.get("PORT") || 8888;
import "./dbConnect.js"
const app = express();

const __filename = fileURLToPath(import.meta.url); //
const __dirname = path.dirname(__filename);


app.use(express.json()); //body-Parser
app.use(express.static(path.join(__dirname, "build")));


app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use("/api/auto", autoRouter)

console.log(config.get("URL"));



app.listen(PORT, () => {
  console.log(`Server Started AT ${PORT}`);
  console.log(`Yoo Deployed at : ${config.get("URL")}`)
});