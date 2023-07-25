import express from "express";
import cors from "cors";
import { response } from "./response";
import baseResponse from "./baseResponeStatus";
import recordsRouter from "../src/records/recordsRouter";
import placesRouter from "../src/places/placesRouter";
import reviewsRouter from "../src/reviews/reviewsRouter";
import authRouter from "../src/auth/authRouter";
import usersRouter from "../src/users/usersRouter";
import activitiesRouter from "../src/activities/activitiesRouter";
import middlewares from "./middlewares";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(middlewares.logger);

app.get("/health", (req, res) => res.status(200).send(response(baseResponse.SUCCESS, "Hello World!")));

app.use("/places", middlewares.authCheck, placesRouter);
app.use("/records", middlewares.authCheck, recordsRouter);
app.use("/reviews", middlewares.authCheck, reviewsRouter);
app.use("/users", middlewares.authCheck, usersRouter);
app.use("/auth", authRouter);
app.use("/activities", middlewares.authCheck, activitiesRouter);

export default app;
