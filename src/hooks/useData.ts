// src/hooks/useData.ts
import { useState, useEffect } from 'react';
import { GraphQLClient, gql } from 'graphql-request';
// Access environment variables using import.meta.env
const API_URL = import.meta.env.DEV 
  ? import.meta.env.VITE_LOCAL_API_URL 
  : import.meta.env.VITE_LIVE_API_URL;  

interface Review {
    id: string;
    source: string;
    text: string;
    rating: number;
    sentiment: string;
    category: string[];
    date: string;
}

interface Survey {
    id: string;
    respondent_id: string;
    question: string;
    response: string;
    sentiment: string;
    category: string[];
    date: string;
}

interface SocialMedia {
    id: string;
    platform: string;
    username: string;
    text: string;
    hashtags: string[];
    likes: number;
    sentiment: string;
    date: string;
}

interface CustomerSupport {
    id: string;
    interaction_type: string;
    customer_id: string;
    agent_id: string;
    text: string;
    resolution_status: string;
    sentiment: string;
    category: string[];
    date: string;
}

interface Data {
    reviews: Review[];
    surveys: Survey[];
    socialMediaPosts: SocialMedia[];
    customerSupportTickets: CustomerSupport[];
}

const useData = () => {
    const [data, setData] = useState<Data | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const client = new GraphQLClient(API_URL);
                const query = gql`
                    query {
                        reviews {
                            id
                            source
                            text
                            rating
                            sentiment
                            category
                            date
                        }
                        surveys {
                            id
                            respondent_id
                            question
                            response
                            sentiment
                            category
                            date
                        }
                        socialMediaPosts {
                            id
                            platform
                            username
                            text
                            hashtags
                            likes
                            sentiment
                            date
                        }
                        customerSupportTickets {
                            id
                            interaction_type
                            customer_id
                            agent_id
                            text
                            resolution_status
                            sentiment
                            category
                            date
                        }
                    }
                `;

                const result = await client.request(query);
                setData(result);
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};

export default useData;
