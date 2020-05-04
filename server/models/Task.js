const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const states = {
  values: ["TO_DO", "IN_PROGRESS", "DONE"],
  message: "{VALUE} no es un estado válido",
};

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Título requerido"],
      min: 2,
      max: 100,
    },
    description: {
      type: String,
      max: 1000,
    },
    state: {
      type: String,
      default: "TO_DO",
      enum: states,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "tasks" }
);

module.exports = mongoose.model("Task", taskSchema);
