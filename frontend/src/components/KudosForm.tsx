import React, { useState, useEffect } from 'react';
import { userService, kudosService } from '../services/api';
import { User } from '../types';
import './KudosForm.css';

interface KudosFormProps {
  onSuccess?: () => void;
}

export const KudosForm: React.FC<KudosFormProps> = ({ onSuccess }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, [searchTerm]);

  const loadUsers = async () => {
    try {
      const response = await userService.getUsers(0, 100, searchTerm);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!selectedUserId || !message.trim()) {
      setError('Please select a user and enter a message');
      return;
    }

    if (message.length > 500) {
      setError('Message cannot exceed 500 characters');
      return;
    }

    try {
      setLoading(true);
      await kudosService.createKudos(parseInt(selectedUserId), message);
      setSuccess(true);
      setMessage('');
      setSelectedUserId('');
      if (onSuccess) onSuccess();
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to submit kudos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kudos-form">
      <h2>Give Kudos</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Kudos submitted successfully!</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="user-search">Select Colleague</label>
          <input
            type="text"
            id="user-search"
            placeholder="Search colleagues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            required
          >
            <option value="">Choose a colleague...</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.first_name} {user.last_name} (@{user.username})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="message">Message of Appreciation</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 500))}
            placeholder="Write your appreciation message (max 500 characters)"
            rows={4}
            required
          />
          <div className="char-count">{message.length}/500</div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Kudos'}
        </button>
      </form>
    </div>
  );
};
