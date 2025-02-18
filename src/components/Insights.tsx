import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, TrendingUp, AlertCircle } from 'lucide-react';

interface FeedbackItem {
  id: string;
  text: string;
  sentiment: string;
  category: string[];
  date: string;
}

interface FeedbackData {
  reviews: FeedbackItem[];
  surveys: FeedbackItem[];
  socialMediaPosts: FeedbackItem[];
  customerSupportTickets: FeedbackItem[];
}

interface InsightsProps {
  data: FeedbackData;
}

const Insights: React.FC<InsightsProps> = ({ data }) => {

  const analyzeTopIssues = (items: FeedbackItem[]) => {
    console.log(items,'items');
    const categoryCounts: { [key: string]: { count: number; sentiment: string[] } } = {};
    
    if (!items) return [];
    items.forEach(item => {

        if (!item.category) {
            return
        }
      item.category.forEach(category => {
        if (!categoryCounts[category]) {
          categoryCounts[category] = { count: 0, sentiment: [] };
        }
        categoryCounts[category].count++;
        categoryCounts[category].sentiment.push(item.sentiment);
      });
    });

    return Object.entries(categoryCounts)
      .map(([category, data]) => ({
        category,
        count: data.count,
        negativePercentage: (data.sentiment.filter(s => s === 'negative').length / data.count) * 100
      }))
      .sort((a, b) => b.negativePercentage - a.negativePercentage)
      .slice(0, 3);
  };

  const generateInsightCard = (title: string, description: string, recommendations: string[], priority: 'high' | 'medium' | 'low') => {
    const priorityColors = {
      high: 'bg-red-100 dark:bg-red-900',
      medium: 'bg-yellow-100 dark:bg-yellow-900',
      low: 'bg-green-100 dark:bg-green-900'
    };

    return (
      <Card className={`${priorityColors[priority]} border-none`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {priority === 'high' && <AlertTriangle className="w-5 h-5 text-red-500" />}
            {priority === 'medium' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
            {priority === 'low' && <TrendingUp className="w-5 h-5 text-green-500" />}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm">{description}</p>
          <div className="space-y-2">
            <h4 className="font-semibold">Recommendations:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  };

  const analyzeSourceData = (source: FeedbackItem[]) => {
    const topIssues = analyzeTopIssues(source);
    const insights: { title: string; description: string; recommendations: string[]; priority: 'high' | 'medium' | 'low' }[] = [];

    // Generate insights based on top issues
    topIssues.forEach(issue => {
      if (issue.negativePercentage > 50) {
        insights.push({
          title: `${issue.category} Concerns`,
          description: `${issue.negativePercentage.toFixed(1)}% negative feedback rate in ${issue.category} category with ${issue.count} mentions.`,
          recommendations: [
            `Review and improve ${issue.category.toLowerCase()} processes`,
            `Conduct customer interviews focused on ${issue.category.toLowerCase()}`,
            `Implement immediate fixes for critical ${issue.category.toLowerCase()} issues`
          ],
          priority: 'high' as const
        });
      }
    });

    return insights;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">Actionable Insights</h2>
      
      <Tabs defaultValue="reviews" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reviews">Reviews Insights</TabsTrigger>
          <TabsTrigger value="surveys">Survey Insights</TabsTrigger>
          <TabsTrigger value="social">Social Media Insights</TabsTrigger>
          <TabsTrigger value="support">Support Insights</TabsTrigger>
        </TabsList>


<TabsContent value="reviews" className="space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {analyzeSourceData(data.reviews).map((insight, index) => (
      <div key={`review-insight-${index}`}>
        {generateInsightCard(
          insight.title,
          insight.description,
          insight.recommendations,
          insight.priority
        )}
      </div>
    ))}
  </div>
</TabsContent>

<TabsContent value="surveys" className="space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {analyzeSourceData(data.surveys).map((insight, index) => (
      <div key={`survey-insight-${index}`}>
        {generateInsightCard(
          insight.title,
          insight.description,
          insight.recommendations,
          insight.priority
        )}
      </div>
    ))}
  </div>
</TabsContent>

<TabsContent value="social" className="space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {analyzeSourceData(data.socialMediaPosts).map((insight, index) => (
      <div key={`social-insight-${index}`}>
        {generateInsightCard(
          insight.title,
          insight.description,
          insight.recommendations,
          insight.priority
        )}
      </div>
    ))}
  </div>
</TabsContent>

<TabsContent value="support" className="space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {analyzeSourceData(data.customerSupportTickets).map((insight, index) => (
      <div key={`support-insight-${index}`}>
        {generateInsightCard(
          insight.title,
          insight.description,
          insight.recommendations,
          insight.priority
        )}
      </div>
    ))}
  </div>
</TabsContent>

      </Tabs>
    </div>
  );
};

export default Insights;