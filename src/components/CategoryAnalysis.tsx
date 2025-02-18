import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Info,

} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FeedbackItem {
  category: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
}

interface FeedbackData {
  reviews: FeedbackItem[];
  surveys: FeedbackItem[];
  socialMediaPosts: FeedbackItem[];
  customerSupportTickets: FeedbackItem[];
}

interface CategoryData {
  total: number;
  positive: number;
  negative: number;
  neutral: number;
}

interface CategoryAnalysisProps {
  data: FeedbackData;
}

const CategoryAnalysis: React.FC<CategoryAnalysisProps> = ({ data }) => {
  const getCategoryData = (items: FeedbackItem[]) => {
    const categories: Record<string, CategoryData> = {};
    
    items.forEach(item => {
      if (Array.isArray(item.category)) {
        item.category.forEach((category: string) => {
          if (!categories[category]) {
            categories[category] = { total: 0, positive: 0, negative: 0, neutral: 0 };
          }
          categories[category].total++;
          categories[category][item.sentiment]++;
        });
      }
    });

    return categories;
  };

  const createBarChartData = (categoryData: Record<string, CategoryData>) => {
    const sortedCategories = Object.entries(categoryData)
      .sort(([, a], [, b]) => (b as CategoryData).total - (a as CategoryData).total);

    return {
      labels: sortedCategories.map(([category]) => category),
      datasets: [
        {
          label: 'Positive',
          data: sortedCategories.map(([, data]) => (data as CategoryData).positive),
          backgroundColor: '#22c55e',
          stack: 'Stack 0',
        },
        {
          label: 'Neutral',
          data: sortedCategories.map(([, data]) => (data as CategoryData).neutral),
          backgroundColor: '#f59e0b',
          stack: 'Stack 0',
        },
        {
          label: 'Negative',
          data: sortedCategories.map(([, data]) => (data as CategoryData).negative),
          backgroundColor: '#ef4444',
          stack: 'Stack 0',
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  const renderInfoTooltip = (content: string) => (
    <TooltipProvider>
      <UITooltip>
        <TooltipTrigger>
          <Info className="h-4 w-4 ml-2 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-sm">{content}</p>
        </TooltipContent>
      </UITooltip>
    </TooltipProvider>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center">
          <h2 className="text-3xl font-bold text-foreground">Category Analysis</h2>
          {renderInfoTooltip(
            "Analyze feedback categories across different channels to identify trending topics and areas of concern."
          )}
        </div>
        <p className="text-muted-foreground">
          Visualizes the distribution of feedback categories by sentiment. Each bar represents
          the total mentions of a category, split by positive, neutral, and negative sentiments.
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
          <TabsTrigger value="support">
            Support ({data.customerSupportTickets.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reviews">
          <Card>
            <CardHeader className="space-y-2">
              <div className="flex items-center">
                <CardTitle>Category Distribution - Reviews</CardTitle>
                {renderInfoTooltip(
                  "Analysis of product review categories from various e-commerce platforms"
                )}
              </div>
              <div className="flex space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#22c55e] rounded-full mr-2" />
                  <span>Positive</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#f59e0b] rounded-full mr-2" />
                  <span>Neutral</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#ef4444] rounded-full mr-2" />
                  <span>Negative</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[500px]">
                <Bar 
                  data={createBarChartData(getCategoryData(data.reviews))} 
                  options={chartOptions}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                * Categories are sorted by total mention count. Hover over bars for detailed counts.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="surveys">
          <Card>
            <CardHeader className="space-y-2">
              <div className="flex items-center">
                <CardTitle>Category Distribution - Surveys</CardTitle>
                {renderInfoTooltip(
                  "Analysis of customer survey responses categorized by topic and sentiment"
                )}
              </div>
              <div className="flex space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#22c55e] rounded-full mr-2" />
                  <span>Positive</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#f59e0b] rounded-full mr-2" />
                  <span>Neutral</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#ef4444] rounded-full mr-2" />
                  <span>Negative</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[500px]">
                <Bar 
                  data={createBarChartData(getCategoryData(data.surveys))} 
                  options={chartOptions}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                * Categories are sorted by total mention count. Hover over bars for detailed counts.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader className="space-y-2">
              <div className="flex items-center">
                <CardTitle>Category Distribution - Social Media</CardTitle>
                {renderInfoTooltip(
                  "Analysis of social media posts categorized by topic and sentiment"
                )}
              </div>
              <div className="flex space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#22c55e] rounded-full mr-2" />
                  <span>Positive</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#f59e0b] rounded-full mr-2" />
                  <span>Neutral</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#ef4444] rounded-full mr-2" />
                  <span>Negative</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[500px]">
                <Bar 
                  data={createBarChartData(getCategoryData(data.socialMediaPosts))} 
                  options={chartOptions}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                * Categories are sorted by total mention count. Hover over bars for detailed counts.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <Card>
            <CardHeader className="space-y-2">
              <div className="flex items-center">
                <CardTitle>Category Distribution - Customer Support</CardTitle>
                {renderInfoTooltip(
                  "Analysis of customer support tickets categorized by topic and sentiment"
                )}
              </div>
              <div className="flex space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#22c55e] rounded-full mr-2" />
                  <span>Positive</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#f59e0b] rounded-full mr-2" />
                  <span>Neutral</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#ef4444] rounded-full mr-2" />
                  <span>Negative</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[500px]">
                <Bar 
                  data={createBarChartData(getCategoryData(data.customerSupportTickets))} 
                  options={chartOptions}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                * Categories are sorted by total mention count. Hover over bars for detailed counts.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="rounded-lg bg-muted p-4 mt-6">
        <h3 className="font-semibold mb-2">How to Read This Chart</h3>
        <ul className="text-sm space-y-2 text-muted-foreground">
          <li>• Bars show the total mentions of each category</li>
          <li>• Colors represent sentiment distribution within each category</li>
          <li>• Categories are sorted by total mention count (descending)</li>
          <li>• Hover over segments to see exact counts</li>
          <li>• Use tabs to switch between different feedback sources</li>
        </ul>
      </div>
    </div>
  );
};

export default CategoryAnalysis;