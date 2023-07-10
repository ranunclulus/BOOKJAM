import express from "express";
import cors from "cors";
import { response } from "./response";
import baseResponse from "./baseResponeStatus";

const app = express();
const port = 3000;
app.use(cors());

app.get("/", (req, res) => res.status(200).send(response(baseResponse.SUCCESS, "Hello World!")));

export default app;
