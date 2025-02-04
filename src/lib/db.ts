import postgres from 'postgres'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("❌ DATABASE_URL is not defined! Please check your .env file or environment variables.")
}

// Initialize the PostgreSQL client
const sql = postgres(connectionString, { ssl: 'require' }) // Supabase requires SSL

export default sql
