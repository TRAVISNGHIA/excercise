import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
    encodedId: String,
    address: String,
});

export default mongoose.models.Location || mongoose.model("Location", LocationSchema);
