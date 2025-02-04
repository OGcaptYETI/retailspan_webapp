import 'dotenv/config';
import sql from './db';  // ✅ Make sure this matches your db.ts location

async function testConnection() {
  try {
    const result = await sql`SELECT NOW() AS current_time`;
    console.log("✅ Database connected! Current time:", result[0].current_time);
  } catch (error) {
    console.error("❌ Error connecting to the database:", error);
  }
}

testConnection();
// 
