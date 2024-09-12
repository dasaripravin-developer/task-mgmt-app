import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
   _id: { type: String, required: true }, // This will be the name of the counter (e.g., 'taskId', 'userId')
   sequence_value: { type: Number, default: 0 }, // This will store the last used sequence number
});

const Counter = mongoose.model("Counter", counterSchema);

async function getNextSequenceValue(sequenceName) {
   const counter = await Counter.findOneAndUpdate(
      { _id: sequenceName }, // The name of the sequence (e.g., 'taskId')
      { $inc: { sequence_value: 1 } }, // Increment the sequence value
      { new: true, upsert: true } // Return the new value, and create the counter document if it doesn't exist
   );
   return counter.sequence_value;
}

export { Counter, getNextSequenceValue };
