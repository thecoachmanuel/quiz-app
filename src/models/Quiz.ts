import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuiz extends Document {
  title: string;
  slug: string;
  category: string;
  description?: string;
  image?: string;
  points: number;
  total_questions: number;
  duration_minutes: number;
  status: "published" | "draft";
  created_at: Date;
  updated_at: Date;
}

const QuizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, default: "General Knowledge" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    points: { type: Number, default: 10 },
    total_questions: { type: Number, default: 10 },
    duration_minutes: { type: Number, default: 15 },
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const Quiz: Model<IQuiz> =
  mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema);

export default Quiz;
