import { Schema, model, models } from "mongoose";

const TrainScheduleSchema = new Schema(
  {
    trainNumber: {
      type: String,
      required: true,
      index: true,
    },

    stationCode: String,

    stationName: String,

    arrivalTime: String,

    departureTime: String,

    distance: Number,

    sequence: Number,
  },
  {
    timestamps: true,
  }
);

export default models.TrainSchedule ||
  model("TrainSchedule", TrainScheduleSchema);