
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FeedbackData {
  reviews: any[];
  surveys: any[];
  socialMediaPosts: any[];
  customerSupportTickets: any[];
}

interface CategoryAnalysisProps {
  data: FeedbackData;
}

const CategoryAnalysis: React.FC<CategoryAnalysisProps> = ({ data }) => {
  const getCategoryData = (items: any[]) => {
    const categories: { [key: string]: { total: number, positive: number, negative: number, neutral: number } } = {};
    
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

  const createBarChartData = (categoryData: any) => {
    const sortedCategories = Object.entries(categoryData)
      .sort(([, a], [, b]) => b.total - a.total);

    return {
      labels: sortedCategories.map(([category]) => category),
      datasets: [
        {
          label: 'Positive',
          data: sortedCategories.map(([, data]) => data.positive),
          backgroundColor: '#22c55e',
          stack: 'Stack 0',
        },
        {
          label: 'Neutral',
          data: sortedCategories.map(([, data]) => data.neutral),
          backgroundColor: '#f59e0b',
          stack: 'Stack 0',
        },
        {
          label: 'Negative',
          data: sortedCategories.map(([, data]) => data.negative),
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

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">Category Analysis</h2>
      <Tabs defaultValue="reviews" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="surveys">Surveys</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="support">Customer Support</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Category Distribution - Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px]">
                <Bar 
                  data={createBarChartData(getCategoryData(data.reviews))} 
                  options={chartOptions}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="surveys">
          <Card>
            <CardHeader>
              <CardTitle>Category Distribution - Surveys</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px]">
                <Bar 
                  data={createBarChartData(getCategoryData(data.surveys))} 
                  options={chartOptions}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Category Distribution - Social Media</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px]">
                <Bar 
                  data={createBarChartData(getCategoryData(data.socialMediaPosts))} 
                  options={chartOptions}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <Card>
            <CardHeader>
              <CardTitle>Category Distribution - Customer Support</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px]">
                <Bar 
                  data={createBarChartData(getCategoryData(data.customerSupportTickets))} 
                  options={chartOptions}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CategoryAnalysis;