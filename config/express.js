import express from "express";
import cors from "cors";
import { response } from "./response";
import baseResponse from "./baseResponeStatus";
import recordsRouter from "../src/records/recordsRouter";
import placesRouter from "../src/places/placesRouter";
import reviewsRouter from "../src/reviews/reviewsRouter";
import activityRoute from "../src/Activity/activityRoute";
import userRouter from "../src/user/userRouter";

const app = express();

app.use(cors());

app.get("/", (req, res) => res.status(200).send(response(baseResponse.SUCCESS, "Hello World!")));

app.use("/places", placesRouter);
app.use("/records", recordsRouter);
app.use("/reviews", reviewsRouter);
app.use(activityRoute)
app.use("/user", userRouter);

export default app;
