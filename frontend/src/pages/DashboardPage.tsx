import React from 'react';
import { KudosForm } from '../components/KudosForm';
import { KudosFeed } from '../components/KudosFeed';
import './DashboardPage.css';

export const DashboardPage: React.FC = () => {
  const [feedKey, setFeedKey] = React.useState(0);

  const handleKudosSuccess = () => {
    setFeedKey(k => k + 1);
  };

  return (
    <div className="dashboard-page">
      <h1>Welcome to Kudos System</h1>

      <div className="dashboard-container">
        <div className="sidebar">
          <KudosForm onSuccess={handleKudosSuccess} />
        </div>

        <div className="main-content">
          <h2>Recent Kudos Feed</h2>
          <KudosFeed key={feedKey} />
        </div>
      </div>
    </div>
  );
};
