// backend/models/SocialMedia.js
 import mongoose from 'mongoose';

 const socialMediaSchema = new mongoose.Schema({
     platform: String,
     username: String,
     text: String,
     hashtags: [String],
     likes: Number,
     sentiment: String,
     date: Date
 });

 const SocialMedia = mongoose.model('SocialMedia', socialMediaSchema);

 export default SocialMedia;