
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { scheduleSpreads } from './jobs/cron-spreads.js';
import betRouter from './routes/bet.js';
import leagueRouter from './routes/league.js';
import postRoutes from './routes/posts.js';
import spreadsRouter from './routes/spreads.js';
import teamRouter from './routes/team.js';
import userRouter from "./routes/user.js";
import { getScores } from './utilities/scores.js';
import { saveSpreads } from './utilities/spreads.js';

const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

app.use('/posts', postRoutes);
app.use("/user", userRouter);
app.use('/spreads', spreadsRouter);
app.use('/bet', betRouter);
app.use('/league', leagueRouter);
app.use('/team', teamRouter);

const CONNECTION_URL = 'mongodb+srv://jcz:Hova8242$@cluster0.2lvfr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
// const PORT = process.env.PORT|| 5000;
const PORT = 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);

scheduleSpreads();

getScores().then(scores => {
  saveSpreads(JSON.stringify(scores));
});