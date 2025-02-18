// backend/schemas/schema.js
import { GraphQLObjectType, GraphQLSchema, GraphQLList, GraphQLString, GraphQLInt } from 'graphql';
import Review from '../models/Review.js';
import Survey from '../models/Survey.js';
import SocialMedia from '../models/SocialMedia.js';
import CustomerSupport from '../models/CustomerSupport.js';

// Review Type
const ReviewType = new GraphQLObjectType({
    name: 'Review',
    fields: () => ({
        id: { type: GraphQLString },
        source: { type: GraphQLString },
        text: { type: GraphQLString },
        rating: { type: GraphQLInt },
        sentiment: { type: GraphQLString },
        category: { type: new GraphQLList(GraphQLString) },
        date: { type: GraphQLString }
    })
});

// Survey Type
const SurveyType = new GraphQLObjectType({
    name: 'Survey',
    fields: () => ({
        id: { type: GraphQLString },
        respondent_id: { type: GraphQLString },
        question: { type: GraphQLString },
        response: { type: GraphQLString },
        sentiment: { type: GraphQLString },
        category: { type: new GraphQLList(GraphQLString) },
        date: { type: GraphQLString }
    })
});

// Social Media Type
const SocialMediaType = new GraphQLObjectType({
    name: 'SocialMedia',
    fields: () => ({
        id: { type: GraphQLString },
        platform: { type: GraphQLString },
        username: { type: GraphQLString },
        text: { type: GraphQLString },
        hashtags: { type: new GraphQLList(GraphQLString) },
        likes: { type: GraphQLInt },
        sentiment: { type: GraphQLString },
        date: { type: GraphQLString }
    })
});

// Customer Support Type
const CustomerSupportType = new GraphQLObjectType({
    name: 'CustomerSupport',
    fields: () => ({
        id: { type: GraphQLString },
        interaction_type: { type: GraphQLString },
        customer_id: { type: GraphQLString },
        agent_id: { type: GraphQLString },
        text: { type: GraphQLString },
        resolution_status: { type: GraphQLString },
        sentiment: { type: GraphQLString },
        category: { type: new GraphQLList(GraphQLString) },
        date: { type: GraphQLString }
    })
});

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        reviews: {
            type: new GraphQLList(ReviewType),
            resolve(parent, args) {
                return Review.find({});
            }
        },
        surveys: {
            type: new GraphQLList(SurveyType),
            resolve(parent, args) {
                return Survey.find({});
            }
        },
        socialMediaPosts: {
            type: new GraphQLList(SocialMediaType),
            resolve(parent, args) {
                return SocialMedia.find({});
            }
        },
        customerSupportTickets: {
            type: new GraphQLList(CustomerSupportType),
            resolve(parent, args) {
                return CustomerSupport.find({});
            }
        }
    }
});

export const schema = new GraphQLSchema({
    query: RootQuery
});
