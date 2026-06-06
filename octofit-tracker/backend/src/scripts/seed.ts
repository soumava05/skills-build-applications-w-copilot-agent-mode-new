import mongoose from 'mongoose';
import dotenv from 'dotenv';
// Inline model definitions to avoid import resolution issues when running
// the seed script under ts-node/ESM in this environment.
import { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const ActivitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    calories: { type: Number, required: false, default: 0 },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);
const Activity = mongoose.model('Activity', ActivitySchema);

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit';

async function main() {
  console.log('Connecting to MongoDB...', MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log('Connected. Clearing existing data...');

  await Activity.deleteMany({});
  await User.deleteMany({});

  console.log('Creating users...');
  const users = await User.create([
    { name: 'Alice Runner', email: 'alice@example.com' },
    { name: 'Bob Cyclist', email: 'bob@example.com' },
  ]);

  console.log('Creating activities...');
  const activities = [
    {
      user: users[0]._id,
      type: 'running',
      durationMinutes: 30,
      calories: 300,
      date: new Date(),
    },
    {
      user: users[1]._id,
      type: 'cycling',
      durationMinutes: 45,
      calories: 450,
      date: new Date(),
    },
  ];

  await Activity.create(activities);

  console.log('Seed complete. Users and activities added.');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
