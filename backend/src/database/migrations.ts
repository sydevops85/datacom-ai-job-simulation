import { executeQuery } from './connection';

export async function runMigrations() {
  try {
    // Create users table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create kudos table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS kudos (
        id INT PRIMARY KEY AUTO_INCREMENT,
        giver_id INT NOT NULL,
        recipient_id INT NOT NULL,
        message TEXT NOT NULL,
        is_visible BOOLEAN DEFAULT TRUE,
        moderated_by INT,
        moderated_at TIMESTAMP NULL,
        moderation_reason VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (giver_id) REFERENCES users(id) ON DELETE RESTRICT,
        FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE RESTRICT,
        FOREIGN KEY (moderated_by) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_created_at (created_at DESC),
        INDEX idx_recipient_id (recipient_id),
        INDEX idx_is_visible (is_visible)
      )
    `);

    // Create moderation_logs table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS moderation_logs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        kudos_id INT NOT NULL,
        admin_id INT NOT NULL,
        action ENUM('hide', 'delete', 'restore') NOT NULL,
        reason VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (kudos_id) REFERENCES kudos(id) ON DELETE CASCADE,
        FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE RESTRICT,
        INDEX idx_created_at (created_at DESC)
      )
    `);

    console.log('Database migrations completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}
