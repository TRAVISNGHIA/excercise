import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI ;

if (!global.mongoose) {
    global.mongoose = mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

export default global.mongoose;