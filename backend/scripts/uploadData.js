// backend/scripts/uploadData.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB for data upload');
    uploadData();
}).catch(err => {
    console.error('MongoDB connection error:', err);
});


// TO Run this file, use the following command:
// node backend/scripts/uploadData.mjs
