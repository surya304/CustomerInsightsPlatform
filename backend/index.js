// backend/index.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './schemas/schema.js'; // Import GraphQL schema
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());  // Enable CORS for cross-origin requests
app.use(express.json()); // Parse JSON request bodies

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// GraphQL Endpoint
app.use('/graphql', graphqlHTTP({
    schema: schema,  // Use the imported GraphQL schema
    graphiql: true,   // Enable GraphiQL for testing in development
}));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
