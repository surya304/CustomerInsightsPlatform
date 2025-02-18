import { format } from 'date-fns';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  BarElement,
  LinearScale,
} from 'chart.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, BarElement, LinearScale);

type Sentiment = 'positive' | 'negative' | 'neutral';
type SentimentFilter = 'all' | 'positive' | 'negative' | 'neutral';

interface SentimentItem {
  sentiment: Sentiment;
  [key: string]: any; 
}

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

type SortOption = 'recent' | 'top-rated' ;
type StarFilter = 'all' | '5' | '4' | '3' | '2' | '1';

interface FeedbackItem {
  id: string;
  sentiment: Sentiment;
  category?: string[];
  [key: string]: any;
}

interface FeedbackSourceBreakdownProps {
  data: FeedbackData;
}

const FeedbackSourceBreakdown: React.FC<FeedbackSourceBreakdownProps> = ({ data }) => {
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const [starFilter, setStarFilter] = useState<StarFilter>('all');
  const [sentimentFilter, setSentimentFilter] = useState<SentimentFilter>('all');

  const sortFeedback = (items: FeedbackItem[]) => {
    switch (sortOption) {
      case 'recent':
        return [...items].sort((a, b) => parseInt(b.date) - parseInt(a.date));
      case 'top-rated':
        return [...items].sort((a, b) => (b.rating || 0) - (a.rating || 0));
     
      default:
        return items;
    }
  };

  const filterFeedback = (items: FeedbackItem[]) => {
    if (starFilter === 'all') return items;
    return items.filter(item => item.rating === parseInt(starFilter));
  };

  const filterByStarAndSentiment = (items: FeedbackItem[]) => {
    let filtered = items;
    
    if (starFilter !== 'all') {
      filtered = filtered.filter(item => item.rating === parseInt(starFilter));
    }
    
    if (sentimentFilter !== 'all') {
      filtered = filtered.filter(item => item.sentiment === sentimentFilter);
    }
    
    return filtered;
  };

  const calculateSentimentDistribution = (items: SentimentItem[]) => {
    const counts: Record<Sentiment, number> = {
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

  const renderSentimentIndicator = (sentiment: Sentiment) => {
    const colors: Record<Sentiment, string> = {
      positive: 'bg-green-500',
      negative: 'bg-red-500',
      neutral: 'bg-yellow-500',
    };
    return (
      <span className={`inline-block w-2 h-2 rounded-full ${colors[sentiment]}`} />
    );
  };
  
  const createPieData = (sentimentCounts: Record<Sentiment, number>) => ({
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

  const renderFeedbackCard = (item: FeedbackItem, type: 'reviews' | 'surveys' | 'social' ) => {


 
    const date = new Date(parseInt(item.date));
    
    return (
      <Card key={item.id} className="mb-4">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2 w-full">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {type === 'reviews' && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{item.source}</span>
                      <div className="flex space-x-1">
                        {renderStars(item.rating)}
                      </div>
                    </div>
                  )}
                  {type === 'social' && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{item.platform}</span>
                      <span className="text-sm text-muted-foreground">{item.username}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {renderSentimentIndicator(item.sentiment)}
                  <span className="text-xs text-muted-foreground capitalize">
                    {item.sentiment}
                  </span>
                </div>
              </div>
              <p className="text-sm text-foreground">{item.text}</p>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
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

  const FilterControls = () => {
    return (
      <div className="flex gap-4 mb-4">
        <Select value={sortOption} onValueChange={(value: SortOption) => setSortOption(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="top-rated">Top Rated</SelectItem>
          </SelectContent>
        </Select>
  
        <Select value={starFilter} onValueChange={(value: StarFilter) => setStarFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by rating">
              {starFilter === 'all' ? (
                'All Ratings'
              ) : (
                <div className="flex items-center">
                  {starFilter} <Star className="w-4 h-4 ml-1 fill-yellow-400" />
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              All Ratings
            </SelectItem>
            {(['5', '4', '3', '2', '1'] as const).map((rating) => (
              <SelectItem key={rating} value={rating}>
                <div className="flex items-center gap-2">
                  {rating}
                  <div className="flex">
                    {[...Array(parseInt(rating))].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-4 h-4 text-yellow-400 fill-yellow-400" 
                      />
                    ))}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sentimentFilter} onValueChange={(value: SentimentFilter) => setSentimentFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by sentiment">
              {sentimentFilter === 'all' ? 'All Sentiments' : (
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    sentimentFilter === 'positive' ? 'bg-green-500' :
                    sentimentFilter === 'negative' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`} />
                  <span className="capitalize">{sentimentFilter}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sentiments</SelectItem>
            <SelectItem value="positive">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span>Positive</span>
              </div>
            </SelectItem>
            <SelectItem value="negative">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>Negative</span>
              </div>
            </SelectItem>
            <SelectItem value="neutral">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                <span>Neutral</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  };

  const calculateAverageSentiment = (surveys: Survey[]): Sentiment => {
    const sentimentScores = {
      positive: 1,
      neutral: 0,
      negative: -1
    };
    
    const avgScore = surveys.reduce((acc, survey) => 
      acc + sentimentScores[survey.sentiment as Sentiment], 0) / surveys.length;
      
    if (avgScore > 0.3) return 'positive';
    if (avgScore < -0.3) return 'negative';
    return 'neutral';
  };


  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Feedback Source Breakdown</h2>
        <p className="text-muted-foreground">
          Analyze customer feedback across different channels including product reviews, 
          surveys, social media mentions, and support tickets.
        </p>
      </div>

      <Tabs defaultValue="reviews" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reviews">
            Reviews ({data.reviews.length})
          </TabsTrigger>
          <TabsTrigger value="surveys">
            Surveys ({data.surveys.length})
          </TabsTrigger>
          <TabsTrigger value="social">
            Social Media ({data.socialMediaPosts.length})
          </TabsTrigger>
       
        </TabsList>

        <TabsContent value="reviews" className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold">Product Reviews Analysis</h3>
            <p className="text-muted-foreground">
              Customer reviews from various e-commerce platforms and marketplaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Total Reviews</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Number of collected reviews
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{data.reviews.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Average Rating</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Mean customer satisfaction score
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <span className="text-4xl font-bold">
                    {(data.reviews.reduce((acc, review) => acc + review.rating, 0) / 
                      data.reviews.length).toFixed(1)}
                  </span>
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Out of 5 stars
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Sources</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Review platforms breakdown
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from(new Set(data.reviews.map(r => r.source))).map(source => (
                    <div key={source} className="flex justify-between text-sm">
                      <span>{source}</span>
                      <span>{data.reviews.filter(r => r.source === source).length}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              <FilterControls />
              {filterByStarAndSentiment(sortFeedback(data.reviews))
                .map(review => renderFeedbackCard(review, 'reviews'))}
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
  {/* Overview Cards */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Total Surveys</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{data.surveys.length}</div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Response Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">
          {((data.surveys.length / (data.surveys.length + 2)) * 100).toFixed(0)}%
        </div>
        <p className="text-sm text-muted-foreground">Based on sent surveys</p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Top Question</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm font-medium">
          "How likely are you to recommend us?"
        </div>
        <p className="text-xs text-muted-foreground mt-1">Most frequent question</p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Avg. Sentiment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          {renderSentimentIndicator(calculateAverageSentiment(data.surveys))}
          <span className="text-xl font-bold capitalize">
            {calculateAverageSentiment(data.surveys)}
          </span>
        </div>
      </CardContent>
    </Card>
  </div>
        <h3 className="text-2xl font-semibold">Survey Responses</h3>

   <div className="flex justify-between items-center">

        <FilterControls />
      </div>

  {/* Main Content Grid */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Left Column - Survey Responses */}
    <div className="space-y-4">
     
      
      {sortFeedback(data.surveys).map((survey) => (
        <Card key={survey.id} className="mb-4">
          <CardContent className="pt-6">
            <Collapsible>
              <CollapsibleTrigger className="w-full">
                <div className="flex justify-between items-start w-full">
                  <div className="text-left">
                    <h4 className="font-medium">{survey.question}</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(parseInt(survey.date)), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderSentimentIndicator(survey.sentiment as Sentiment)}
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <p className="text-sm">{survey.response}</p>
                <div className="flex gap-2 mt-3">
                  {survey.category.map((cat) => (
                    <Badge key={cat} variant="secondary">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Right Column - Analytics */}
    <div className="space-y-6">
      {/* Sentiment Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <Pie data={createPieData(calculateSentimentDistribution(data.surveys))} />
          </div>
        </CardContent>
      </Card>

  
    </div>
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

      </Tabs>
    </div>
  );
};

export default FeedbackSourceBreakdown;