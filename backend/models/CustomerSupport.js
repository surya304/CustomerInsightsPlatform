
 // backend/models/CustomerSupport.js
 import mongoose from 'mongoose';

 const customerSupportSchema = new mongoose.Schema({
     interaction_type: String,
     customer_id: String,
     agent_id: String,
     text: String,
     resolution_status: String,
     sentiment: String,
     category: [String],
     date: Date
 });

 const CustomerSupport = mongoose.model('CustomerSupport', customerSupportSchema);

 export default CustomerSupport;
