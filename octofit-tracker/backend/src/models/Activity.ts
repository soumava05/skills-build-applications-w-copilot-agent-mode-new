import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IActivity extends Document {
  user: IUser['_id'];
  type: string;
  durationMinutes: number;
  calories: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    calories: { type: Number, required: false, default: 0 },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

const Activity = mongoose.model<IActivity>('Activity', ActivitySchema);
export default Activity;
