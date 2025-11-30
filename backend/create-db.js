const { Client } = require('pg');

async function createDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres', // Connect to default database first
  });

  try {
    await client.connect();
    console.log('✓ Connected to PostgreSQL');

    // Check if database exists
    const checkResult = await client.query(
      "SELECT 1 FROM pg_database WHERE datname='financetrackerdb'"
    );

    if (checkResult.rows.length > 0) {
      console.log('✓ Database "financetrackerdb" already exists');
    } else {
      // Create database
      await client.query('CREATE DATABASE financetrackerdb');
      console.log('✓ Database "financetrackerdb" created successfully');
    }

    await client.end();
    console.log('\n✅ Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    await client.end();
    process.exit(1);
  }
}

createDatabase();
