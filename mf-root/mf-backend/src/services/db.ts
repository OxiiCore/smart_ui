import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from '../models/schema';

// Database connection string
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/workflow_app';

// Client for migrations
const migrationClient = postgres(connectionString, { max: 1 });

// Client for queries
const queryClient = postgres(connectionString);

// Initialize Drizzle with our schema
export const db = drizzle(queryClient, { schema });

// Run migrations (uncomment when needed)
async function runMigrations() {
  try {
    console.log('Running migrations...');
    await migrate(drizzle(migrationClient), { migrationsFolder: './drizzle' });
    console.log('Migrations completed.');
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
}

// Export the migration function so it can be called manually
export { runMigrations };