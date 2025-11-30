import fs from 'fs';
import path from 'path';
import pool from '../config/database';

const runMigrations = async () => {
  try {
    console.log('Starting database migrations...');

    // Run schema migrations
    const schemaPath = path.join(__dirname, '../../sql/migrations/001_initial_schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schemaSql);
    console.log('✓ Schema migration completed');

    // Run stored procedures
    const proceduresPath = path.join(__dirname, '../../sql/procedures/user_procedures.sql');
    const proceduresSql = fs.readFileSync(proceduresPath, 'utf8');
    await pool.query(proceduresSql);
    console.log('✓ Stored procedures created');

    console.log('✓ All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Migration failed:', error);
    process.exit(1);
  }
};

runMigrations();
