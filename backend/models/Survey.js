import mongoose from 'mongoose';

 const surveySchema = new mongoose.Schema({
     respondent_id: String,
     question: String,
     response: String,
     sentiment: String,
     category: [String],
     date: Date
 });

 const Survey = mongoose.model('Survey', surveySchema);

 export default Survey;