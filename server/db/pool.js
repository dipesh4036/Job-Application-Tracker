import pg from "pg";
import config from "../config/index.js";

const { Pool } = pg;

const pool = new Pool({
  connectionString: config.databaseUrl,
});


pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error:", err);
  process.exit(-1);
});

export default pool;
