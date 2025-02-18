// backend/scripts/uploadData.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Review from '../models/Review.js';
import Survey from '../models/Survey.js';
import SocialMedia from '../models/SocialMedia.js';
import CustomerSupport from '../models/CustomerSupport.js';
import fs from 'fs';

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

async function uploadData() {
    try {
        // Read JSON files
        const reviewsData = JSON.parse(fs.readFileSync('data/reviews.json', 'utf-8'));
        const surveysData = JSON.parse(fs.readFileSync('data/surveys.json', 'utf-8'));
        const socialMediaData = JSON.parse(fs.readFileSync('data/social_media.json', 'utf-8'));
        const customerSupportData = JSON.parse(fs.readFileSync('data/customer_support.json', 'utf-8'));

        // Insert data into MongoDB (using insertMany for efficiency)
        await Review.insertMany(reviewsData);
        await Survey.insertMany(surveysData);
        await SocialMedia.insertMany(socialMediaData);
        await CustomerSupport.insertMany(customerSupportData);

        console.log('Data uploaded successfully');
        mongoose.connection.close(); // Close the connection after uploading
    } catch (error) {
        console.error('Error uploading data:', error);
    }
}


// TO Run this file, use the following command:
// node backend/scripts/uploadData.mjs
