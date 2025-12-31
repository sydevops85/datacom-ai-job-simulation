import React, { useState, useEffect } from 'react';
import { kudosService } from '../services/api';
import { Kudos } from '../types';
import './KudosFeed.css';

interface KudosFeedProps {
  recipientId?: number;
  isAdmin?: boolean;
}

export const KudosFeed: React.FC<KudosFeedProps> = ({ recipientId, isAdmin }) => {
  const [kudos, setKudos] = useState<Kudos[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    loadKudos();
  }, [page, recipientId]);

  const loadKudos = async () => {
    try {
      setLoading(true);
      const response = await kudosService.getKudosFeed(
        page * ITEMS_PER_PAGE,
        ITEMS_PER_PAGE,
        recipientId
      );
      setKudos(response.data.kudos);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Failed to load kudos feed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (kudos.length === 0) {
    return <div className="empty-state">No kudos yet. Be the first to give one!</div>;
  }

  return (
    <div className="kudos-feed">
      <div className="kudos-list">
        {kudos.map((kudo) => (
          <div key={kudo.id} className="kudos-card">
            <div className="kudos-header">
              <span className="giver">
                <strong>{kudo.giver_username}</strong> gave kudos to
              </span>
              <span className="recipient">
                <strong>{kudo.recipient_username}</strong>
              </span>
            </div>
            <div className="kudos-message">{kudo.message}</div>
            <div className="kudos-footer">
              <span className="timestamp">{new Date(kudo.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {total > ITEMS_PER_PAGE && (
        <div className="pagination">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            Previous
          </button>
          <span className="page-info">
            Page {page + 1} of {Math.ceil(total / ITEMS_PER_PAGE)}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={(page + 1) * ITEMS_PER_PAGE >= total}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
