import React from 'react';
import useData from '../hooks/useData';
import CategoryAnalysis from '../components/CategoryAnalysis';

export function CategoryAnalysisPage() {
  const { data, loading, error } = useData();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div className="space-y-6 p-6">
      <CategoryAnalysis data={data} />
    </div>
  );
}