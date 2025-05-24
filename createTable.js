import {db} from './config/db.js'; // Adjust path as needed

async function createSchoolsTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS schools (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      latitude FLOAT NOT NULL,
      longitude FLOAT NOT NULL
    );
  `;

  try {
    const connection = await db.getConnection();
    await connection.query(createTableSQL);
    connection.release();
    console.log('✅ schools table is ready');
  } catch (error) {
    console.error('❌ Error creating schools table:', error);
  }
}

export default createSchoolsTable;
