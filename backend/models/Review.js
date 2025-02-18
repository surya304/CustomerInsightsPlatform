 // backend/models/Review.js
 import mongoose from 'mongoose';

 const reviewSchema = new mongoose.Schema({
     source: String,
     text: String,
     rating: Number,
     sentiment: String,
     category: [String],
     date: Date
 });

 const Review = mongoose.model('Review', reviewSchema);

 export default Review;
