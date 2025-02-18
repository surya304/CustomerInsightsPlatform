import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Sidebar } from './components/Sidebar';
import { ModeToggle } from './components/mode-toggle';
import { DashboardPage } from './pages/DashboardPage';
import { FeedbackSourcesPage } from './pages/FeedbackSourcesPage';
import { CategoryAnalysisPage } from './pages/CategoryAnalysisPage';
import { InsightsPage } from './pages/InsightsPage';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system">
        <div className="min-h-screen">
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              <div className="ml-auto flex items-center space-x-4">
                <ModeToggle />
              </div>
            </div>
          </div>
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-8 w-[80%]">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/feedback-sources" element={<FeedbackSourcesPage />} />
                <Route path="/category-analysis" element={<CategoryAnalysisPage />} />
                <Route path="/insights" element={<InsightsPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;