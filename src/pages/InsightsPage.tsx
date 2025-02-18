import React from 'react';
import useData from '../hooks/useData';
import Insights from '../components/Insights';

export function InsightsPage() {
  const { data, loading, error } = useData();

  console.log(data,"data");
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div className="space-y-6 p-6">
      <Insights data={data} />
    </div>
  );
}