import express from "express";
import cors from "cors";
import { response } from "./response";
import baseResponse from "./baseResponeStatus";
import placesRouter from "../src/places/placesRouter";

const app = express();
app.use(cors());

app.get("/", (req, res) => res.status(200).send(response(baseResponse.SUCCESS, "Hello World!")));
app.use("/places", placesRouter);

export default app;
