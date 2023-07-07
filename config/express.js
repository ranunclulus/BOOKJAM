import express from "express";
import cors from "cors";









export const app = express();
const port = 3000;
app.use(cors());











app.get('/', (req, res) => res.send('Hello World!'));
