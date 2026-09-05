import mongoose from "mongoose";

// Check if a value is a valid MongoDB ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

export default isValidObjectId;