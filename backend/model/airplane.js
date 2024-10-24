import mongoose from "mongoose";
import airplaneSchema from "./Schema/AirplaneSchema.js";

const Airplane = mongoose.model('airplane', airplaneSchema);

export default Airplane