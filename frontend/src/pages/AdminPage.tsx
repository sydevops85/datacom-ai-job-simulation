import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { ModerationLog } from '../types';
import './AdminPage.css';

export const AdminPage: React.FC = () => {
  const [logs, setLogs] = useState<ModerationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    loadLogs();
  }, [page]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const response = await adminService.getModerationLogs(
        page * ITEMS_PER_PAGE,
        ITEMS_PER_PAGE
      );
      setLogs(response.data.logs);
    } catch (error) {
      console.error('Failed to load moderation logs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-page">
      <h1>Moderation Dashboard</h1>

      <div className="logs-container">
        <h2>Moderation Logs</h2>
        {logs.length === 0 ? (
          <p>No moderation actions yet.</p>
        ) : (
          <table className="logs-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Action</th>
                <th>Reason</th>
                <th>Admin</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.created_at).toLocaleString()}</td>
                  <td>
                    <span className={`action-badge action-${log.action}`}>
                      {log.action.toUpperCase()}
                    </span>
                  </td>
                  <td>{log.reason || '-'}</td>
                  <td>{log.admin_username}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
