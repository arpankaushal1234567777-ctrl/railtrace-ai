import { Schema, model, models } from "mongoose";

const StationSchema = new Schema({
  stationCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },

  stationName: {
    type: String,
    required: true,
    index: true,
  },
});

export default models.Station ||
  model("Station", StationSchema);