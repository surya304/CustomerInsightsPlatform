import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  TrendingUp, 
  AlertCircle, 
  Info,
  HelpCircle 
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const renderInfoTooltip = (content: string) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <HelpCircle className="h-4 w-4 ml-2 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const generateInsightCard = (title: string, description: string, recommendations: string[], priority: 'high' | 'medium' | 'low') => {
    const priorityColors = {
      high: 'bg-red-100 dark:bg-red-900',
      medium: 'bg-yellow-100 dark:bg-yellow-900',
      low: 'bg-green-100 dark:bg-green-900'
    };

    const priorityInfo = {
      high: 'Requires immediate attention',
      medium: 'Should be addressed soon',
      low: 'Monitor for changes'
    };

    return (
      <Card className={`${priorityColors[priority]} border-none`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {priority === 'high' && <AlertTriangle className="w-5 h-5 text-red-500" />}
            {priority === 'medium' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
            {priority === 'low' && <TrendingUp className="w-5 h-5 text-green-500" />}
            {title}
            {renderInfoTooltip(priorityInfo[priority])}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm">{description}</p>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center">
              Recommended Actions
              {renderInfoTooltip("Suggested steps to address this insight")}
            </h4>
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
      <div className="space-y-2">
        <div className="flex items-center">
          <h2 className="text-3xl font-bold text-foreground">Actionable Insights</h2>
          {renderInfoTooltip(
            "Analysis of feedback data highlighting key areas requiring attention"
          )}
        </div>
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-semibold flex items-center mb-2">
            Understanding Priority Levels
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span>High Priority: Immediate action needed</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <span>Medium Priority: Plan to address soon</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>Low Priority: Monitor situation</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="reviews" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reviews">
            Reviews ({data.reviews.length})
            {renderInfoTooltip("Insights from customer product reviews")}
          </TabsTrigger>
          <TabsTrigger value="surveys">
            Surveys ({data.surveys.length})
            {renderInfoTooltip("Insights from customer feedback surveys")}
          </TabsTrigger>
          <TabsTrigger value="social">
            Social Media ({data.socialMediaPosts.length})
            {renderInfoTooltip("Insights from social media mentions")}
          </TabsTrigger>
          <TabsTrigger value="support">
            Support ({data.customerSupportTickets.length})
            {renderInfoTooltip("Insights from customer support interactions")}
          </TabsTrigger>
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

      <div className="text-sm text-muted-foreground mt-4">
        <p className="flex items-center gap-2">
          <Info className="w-4 h-4" />
          Insights are automatically generated based on sentiment analysis and frequency of mentions.
        </p>
      </div>
    </div>
  );
};

export default Insights;