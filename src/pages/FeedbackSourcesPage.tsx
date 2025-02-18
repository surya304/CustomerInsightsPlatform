import React from 'react';
import useData from '../hooks/useData';
import FeedbackSourceBreakdown from '../components/FeedbackSourceBreakdown';
import { Skeleton } from "@/components/ui/skeleton";

export function FeedbackSourcesPage() {
  const { data, loading, error } = useData();

  console.log(data,"data");
  

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-muted-foreground">
        No data available
      </div>
    );
  }

  return <FeedbackSourceBreakdown data={data} />;
}

export default FeedbackSourcesPage;