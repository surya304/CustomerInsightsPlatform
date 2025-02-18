
import { Pie } from 'react-chartjs-2';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import {
  Tooltip as TooltipUI,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale
} from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale);

type Sentiment = 'positive' | 'negative' | 'neutral';


interface FeedbackItem {
  sentiment: Sentiment;  
  category?: string[];
}


interface DashboardData {
  reviews: FeedbackItem[];
  surveys: FeedbackItem[];
  socialMediaPosts: FeedbackItem[];
  customerSupportTickets: FeedbackItem[];
}

interface DashboardSummaryProps {
  data: DashboardData;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ data }) => {
  // Calculate total feedback count
  const totalFeedbackCount = data.reviews.length + data.surveys.length + 
    data.socialMediaPosts.length + data.customerSupportTickets.length;

  // Calculate sentiment counts
  const sentimentCounts: Record<Sentiment, number> = {
    positive: 0,
    negative: 0,
    neutral: 0,
  };
  

  // Count sentiments from all sources
  // [...data.reviews, ...data.surveys, ...data.socialMediaPosts, ...data.customerSupportTickets]
  //   .forEach(item =>
      
  //     console.log(item.sentiment,'item.sentiment');
      
  //     sentimentCounts[item.sentiment]++);


  [...data.reviews, ...data.surveys, ...data.socialMediaPosts, ...data.customerSupportTickets]
  .forEach(item => sentimentCounts[item.sentiment]++);

  // Calculate sentiment score
  const overallSentimentScore = ((sentimentCounts.positive - sentimentCounts.negative) / 
    totalFeedbackCount * 100).toFixed(1);

  // Calculate top categories
  const categoryCount = {};
  const processCategoryData = (item: FeedbackItem) => {
    if (Array.isArray(item.category)) {
      item.category.forEach(cat => {
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
    }
  };

  [...data.reviews, ...data.surveys, ...data.customerSupportTickets]
    .forEach(processCategoryData);

  const topCategory = Object.entries(categoryCount)
    .sort(([,a], [,b]) => (b as number) - (a as number))[0][0];

  // Prepare pie chart data
  const pieData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        data: [sentimentCounts.positive, sentimentCounts.negative, sentimentCounts.neutral],
        backgroundColor: ['#22c55e', '#ef4444', '#f59e0b'],
        borderColor: ['#ffffff'],
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };
  return (
    <div className="space-y-6 p-6 bg-background rounded-lg">
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-foreground">Voice of Customer Dashboard</h1>
      <p className="text-muted-foreground">A comprehensive overview of customer feedback across all channels 
(Social Media, Reviews, Surveys, and Support Tickets)


      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-xl">Total Feedback</CardTitle>
            <TooltipProvider>
              <TooltipUI>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Combined feedback from reviews, surveys, social media, and support tickets</p>
                </TooltipContent>
              </TooltipUI>
            </TooltipProvider>
          </div>
          <CardDescription>Across all channels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold">{totalFeedbackCount}</span>
            <span className="text-sm text-muted-foreground">responses</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-xl">Sentiment Score</CardTitle>
            <TooltipProvider>
              <TooltipUI>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Calculated as (positive - negative) / total feedback × 100</p>
                </TooltipContent>
              </TooltipUI>
            </TooltipProvider>
          </div>
          <CardDescription>Overall customer satisfaction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold">{overallSentimentScore}%</span>
            <span className="text-sm text-muted-foreground">positive</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-xl">Top Category</CardTitle>
            <TooltipProvider>
              <TooltipUI>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Most frequently mentioned topic across all feedback</p>
                </TooltipContent>
              </TooltipUI>
            </TooltipProvider>
          </div>
          <CardDescription>Most discussed topic</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold">{topCategory}</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <CardTitle>Sentiment Distribution</CardTitle>
          <TooltipProvider>
            <TooltipUI>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Distribution of positive, negative, and neutral feedback</p>
              </TooltipContent>
            </TooltipUI>
          </TooltipProvider>
        </div>
        <CardDescription>Breakdown of customer sentiment across all channels</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </CardContent>
    </Card>
  </div>
  );
};

export default DashboardSummary;