// Mock database for demo purposes
// NOTE: In production, replace with actual database connection
// Passwords should be hashed using bcrypt before storing
const mockUsers = [
  { id: 1, username: 'user1', email: 'user1@example.com', password: 'hashed_password_1', first_name: 'User', last_name: 'One', role: 'user', is_active: true },
  { id: 2, username: 'admin', email: 'admin@example.com', password: 'hashed_password_2', first_name: 'Admin', last_name: 'User', role: 'admin', is_active: true },
  { id: 3, username: 'user2', email: 'user2@example.com', password: 'hashed_password_3', first_name: 'User', last_name: 'Two', role: 'user', is_active: true },
  { id: 4, username: 'user3', email: 'user3@example.com', password: 'hashed_password_4', first_name: 'User', last_name: 'Three', role: 'user', is_active: true },
];

const mockKudos: any[] = [];
const mockModerationLogs: any[] = [];

export async function initializeDatabase() {
  console.log('Database initialized (Mock Mode - No MySQL Required)');
}

export async function executeQuery(sql: string, values?: any[]) {
  // Mock SELECT queries
  if (sql.includes('SELECT')) {
    if (sql.includes('FROM users')) {
      if (sql.includes('WHERE username')) {
        const username = values?.[0];
        return mockUsers.filter(u => u.username === username);
      }
      if (sql.includes('WHERE id')) {
        const id = values?.[0];
        return mockUsers.filter(u => u.id == id);
      }
      return mockUsers.filter(u => u.is_active);
    }
    if (sql.includes('FROM kudos')) {
      return mockKudos;
    }
    if (sql.includes('FROM moderation_logs')) {
      return mockModerationLogs;
    }
    return [];
  }

  // Mock INSERT queries
  if (sql.includes('INSERT')) {
    if (sql.includes('INTO kudos')) {
      const id = mockKudos.length + 1;
      const kudos = {
        id,
        giver_id: values?.[0],
        recipient_id: values?.[1],
        message: values?.[2],
        is_visible: true,
        moderated_by: null,
        moderated_at: null,
        moderation_reason: null,
        created_at: new Date(),
      };
      mockKudos.push(kudos);
      return { insertId: id };
    }
    if (sql.includes('INTO moderation_logs')) {
      mockModerationLogs.push({
        id: mockModerationLogs.length + 1,
        kudos_id: values?.[0],
        admin_id: values?.[1],
        action: values?.[2],
        reason: values?.[3],
        created_at: new Date(),
      });
      return {};
    }
  }

  // Mock UPDATE queries
  if (sql.includes('UPDATE')) {
    const kudosId = values?.[values.length - 1];
    const kudos = mockKudos.find(k => k.id == kudosId);
    if (kudos) {
      kudos.is_visible = false;
      kudos.moderated_by = values?.[0];
      kudos.moderated_at = new Date();
      kudos.moderation_reason = values?.[1];
    }
    return {};
  }

  // Mock DELETE queries
  if (sql.includes('DELETE')) {
    const kudosId = values?.[0];
    const index = mockKudos.findIndex(k => k.id == kudosId);
    if (index >= 0) {
      mockKudos.splice(index, 1);
    }
    return {};
  }

  return [];
}
