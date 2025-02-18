
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale);

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

interface SocialMediaPost {
  id: string;
  platform: string;
  username: string;
  text: string;
  hashtags: string[];
  likes: number;
  sentiment: string;
  date: string;
}

interface CustomerSupportTicket {
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

interface FeedbackData {
  reviews: Review[];
  surveys: Survey[];
  socialMediaPosts: SocialMediaPost[];
  customerSupportTickets: CustomerSupportTicket[];
}

interface FeedbackSourceBreakdownProps {
  data: FeedbackData;
}

const FeedbackSourceBreakdown: React.FC<FeedbackSourceBreakdownProps> = ({ data }) => {
  const calculateSentimentDistribution = (items: any[]) => {
    const counts = {
      positive: 0,
      negative: 0,
      neutral: 0,
    };
    items.forEach(item => counts[item.sentiment]++);
    return counts;
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderSentimentIndicator = (sentiment: string) => {
    const colors = {
      positive: 'bg-green-500',
      negative: 'bg-red-500',
      neutral: 'bg-yellow-500',
    };
    return (
      <span className={`inline-block w-2 h-2 rounded-full ${colors[sentiment]}`} />
    );
  };

  const createPieData = (sentimentCounts: any) => ({
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        data: [
          sentimentCounts.positive,
          sentimentCounts.negative,
          sentimentCounts.neutral,
        ],
        backgroundColor: ['#22c55e', '#ef4444', '#f59e0b'],
        borderColor: ['#ffffff'],
        borderWidth: 2,
      },
    ],
  });

  const renderFeedbackCard = (item: any, type: string) => {
    const date = new Date(parseInt(item.date));
    
    return (
      <Card key={item.id} className="mb-4">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2 w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {type === 'reviews' && <span className="text-sm font-medium">{item.source}</span>}
                  {type === 'social' && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{item.platform}</span>
                      <span className="text-sm text-muted-foreground">{item.username}</span>
                    </div>
                  )}
                </div>
                {renderSentimentIndicator(item.sentiment)}
              </div>
              <p className="text-sm text-foreground">{item.text}</p>
              {type === 'reviews' && (
                <div className="flex space-x-1">{renderStars(item.rating)}</div>
              )}
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>{format(date, 'MMM d, yyyy')}</span>
                {type === 'social' && item.likes && (
                  <span>• {item.likes} likes</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">Feedback Source Breakdown</h2>
      <Tabs defaultValue="reviews" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="surveys">Surveys</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="support">Customer Support</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Reviews Count</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{data.reviews.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Average Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <span className="text-4xl font-bold">
                    {(data.reviews.reduce((acc, review) => acc + review.rating, 0) / data.reviews.length).toFixed(1)}
                  </span>
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              {data.reviews.map(review => renderFeedbackCard(review, 'reviews'))}
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Pie data={createPieData(calculateSentimentDistribution(data.reviews))} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Similar structure for other tabs */}
        <TabsContent value="surveys" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              {data.surveys.map(survey => renderFeedbackCard(survey, 'surveys'))}
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Pie data={createPieData(calculateSentimentDistribution(data.surveys))} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              {data.socialMediaPosts.map(post => renderFeedbackCard(post, 'social'))}
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Pie data={createPieData(calculateSentimentDistribution(data.socialMediaPosts))} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="support" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              {data.customerSupportTickets.map(ticket => renderFeedbackCard(ticket, 'support'))}
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Pie data={createPieData(calculateSentimentDistribution(data.customerSupportTickets))} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeedbackSourceBreakdown;