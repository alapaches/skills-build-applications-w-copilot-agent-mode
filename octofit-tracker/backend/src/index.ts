import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import db from './config/database.js';
import Activity from './models/activity.js';
import Leaderboard from './models/leaderboard.js';
import Team from './models/team.js';
import User from './models/user.js';
import Workout from './models/workout.js';
import { createResourceRouter } from './routes/resourceRouter.js';

const app = express();
const port = Number(process.env.PORT ?? 8000);

app.disable('x-powered-by');
app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    database: db.readyState === 1 ? 'connected' : 'connecting',
  });
});

app.use('/api/users', createResourceRouter(User));
app.use('/api/teams', createResourceRouter(Team));
app.use('/api/activities', createResourceRouter(Activity));
app.use('/api/leaderboard', createResourceRouter(Leaderboard, { points: -1 }));
app.use('/api/workouts', createResourceRouter(Workout));

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    response.status(400).json({ error: 'Invalid request data' });
    return;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 11000
  ) {
    response.status(409).json({ error: 'A record with that unique value already exists' });
    return;
  }

  console.error('API request failed:', error);
  response.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`OctoFit API listening on port ${port}`);
});