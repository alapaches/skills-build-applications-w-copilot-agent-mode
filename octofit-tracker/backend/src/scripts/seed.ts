import mongoose from 'mongoose';
import Activity from '../models/activity.js';
import Leaderboard from '../models/leaderboard.js';
import Team from '../models/team.js';
import User from '../models/user.js';
import Workout from '../models/workout.js';

/**
 * Seed the octofit_db database with test data
 */
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

async function seedDatabase() {
  await mongoose.connect(connectionString);

  console.log('Connected to octofit_db');

  try {
    const teamSeeds = [
      { name: 'Trail Blazers', description: 'Outdoor explorers who keep moving.' },
      { name: 'Morning Momentum', description: 'Building healthy habits one morning at a time.' },
    ];
    const teams = new Map<string, (typeof Team.prototype)>();

    for (const seed of teamSeeds) {
      let team = await Team.findOne({ name: seed.name });
      if (team) {
        team.description = seed.description;
        await team.save();
      } else {
        team = await Team.create(seed);
      }
      teams.set(seed.name, team);
    }

    const userSeeds = [
      { username: 'alex_runner', email: 'alex@example.com', displayName: 'Alex Rivera', teamName: 'Trail Blazers' },
      { username: 'sam_cycles', email: 'sam@example.com', displayName: 'Sam Lee', teamName: 'Trail Blazers' },
      { username: 'jordan_moves', email: 'jordan@example.com', displayName: 'Jordan Kim', teamName: 'Morning Momentum' },
    ];
    const users = new Map<string, (typeof User.prototype)>();

    for (const seed of userSeeds) {
      const team = teams.get(seed.teamName);
      if (!team) {
        throw new Error(`Seed team "${seed.teamName}" was not created`);
      }

      let user = await User.findOne({ email: seed.email });
      if (user) {
        user.username = seed.username;
        user.displayName = seed.displayName;
        user.teamId = team._id;
        await user.save();
      } else {
        user = await User.create({
          username: seed.username,
          email: seed.email,
          displayName: seed.displayName,
          teamId: team._id,
        });
      }
      users.set(seed.email, user);
    }

    for (const seed of teamSeeds) {
      const team = teams.get(seed.name);
      if (!team) {
        throw new Error(`Seed team "${seed.name}" was not created`);
      }

      team.memberIds = userSeeds
        .filter((userSeed) => userSeed.teamName === seed.name)
        .map((userSeed) => {
          const user = users.get(userSeed.email);
          if (!user) {
            throw new Error(`Seed user "${userSeed.email}" was not created`);
          }
          return user._id;
        });
      await team.save();
    }

    const activitySeeds = [
      {
        email: 'alex@example.com',
        teamName: 'Trail Blazers',
        activityType: 'Run',
        durationMinutes: 32,
        distanceKilometers: 5,
        points: 50,
        completedAt: new Date('2026-10-01T07:00:00.000Z'),
      },
      {
        email: 'sam@example.com',
        teamName: 'Trail Blazers',
        activityType: 'Cycle',
        durationMinutes: 45,
        distanceKilometers: 14,
        points: 70,
        completedAt: new Date('2026-10-02T07:00:00.000Z'),
      },
      {
        email: 'jordan@example.com',
        teamName: 'Morning Momentum',
        activityType: 'Strength',
        durationMinutes: 30,
        points: 45,
        completedAt: new Date('2026-10-03T07:00:00.000Z'),
      },
    ];

    for (const seed of activitySeeds) {
      const user = users.get(seed.email);
      if (!user) {
        throw new Error(`Seed user "${seed.email}" was not created`);
      }

      const team = teams.get(seed.teamName);
      if (!team) {
        throw new Error(`No seed team found for "${seed.email}"`);
      }

      const activityData = {
        userId: user._id,
        teamId: team._id,
        activityType: seed.activityType,
        durationMinutes: seed.durationMinutes,
        distanceKilometers: seed.distanceKilometers,
        points: seed.points,
        completedAt: seed.completedAt,
      };
      const activity = await Activity.findOne({
        userId: user._id,
        activityType: seed.activityType,
        completedAt: seed.completedAt,
      });
      if (activity) {
        Object.assign(activity, activityData);
        await activity.save();
      } else {
        await Activity.create(activityData);
      }
    }

    const leaderboardSeeds = [
      { email: 'alex@example.com', teamName: 'Trail Blazers', points: 50 },
      { email: 'sam@example.com', teamName: 'Trail Blazers', points: 70 },
      { email: 'jordan@example.com', teamName: 'Morning Momentum', points: 45 },
    ];
    for (const seed of leaderboardSeeds) {
      const user = users.get(seed.email);
      if (!user) {
        throw new Error(`Seed user "${seed.email}" was not created`);
      }
      const team = teams.get(seed.teamName);
      if (!team) {
        throw new Error(`No seed team found for "${seed.email}"`);
      }

      const leaderboard = await Leaderboard.findOne({ userId: user._id });
      if (leaderboard) {
        leaderboard.teamId = team._id;
        leaderboard.points = seed.points;
        await leaderboard.save();
      } else {
        await Leaderboard.create({ userId: user._id, teamId: team._id, points: seed.points });
      }
    }

    const workoutSeeds = [
      {
        name: 'Starter Run',
        description: 'A gentle run-walk session for building endurance.',
        difficulty: 'beginner' as const,
        durationMinutes: 25,
        exercises: ['5-minute warm-up walk', '15-minute easy run-walk', '5-minute cool-down'],
        target: 'Cardio',
      },
      {
        name: 'Full Body Basics',
        description: 'A balanced bodyweight strength session.',
        difficulty: 'beginner' as const,
        durationMinutes: 30,
        exercises: ['Squats', 'Incline push-ups', 'Glute bridges', 'Plank'],
        target: 'Strength',
      },
      {
        name: 'Tempo Builder',
        description: 'A focused session to improve running pace.',
        difficulty: 'intermediate' as const,
        durationMinutes: 40,
        exercises: ['10-minute warm-up', '20-minute tempo run', '10-minute cool-down'],
        target: 'Cardio',
      },
    ];
    for (const seed of workoutSeeds) {
      const workout = await Workout.findOne({ name: seed.name });
      if (workout) {
        Object.assign(workout, seed);
        await workout.save();
      } else {
        await Workout.create(seed);
      }
    }

    console.log('Database seeding complete');
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase().catch((error: unknown) => {
  console.error('Error seeding database:', error);
  process.exitCode = 1;
});
