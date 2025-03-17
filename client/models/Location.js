import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
    encodedId: {
        type: String,
        required: true,
        unique: true },
    name: {
        type: String,
        required: true
    },
    city: String,
    province: String,
    country: {
        type: String,
        default: "Vietnam"
    }
}, { timestamps: true });


const Location = mongoose.model("Location", LocationSchema);

export default Location;