import knex from "knex";
import { configDotenv } from "dotenv";

configDotenv();

const db = knex({
  client: "sqlite3",
  connection: {
    filename: `./${process.env.DB_FILE || "github_analyzer.sqlite"}`,
  },
  useNullAsDefault: true,
});

try {
  const hasTable = await db.schema.hasTable("github_profiles");
  if (!hasTable) {
    await db.schema.createTable("github_profiles", (table) => {
      table.string("username").primary();
      table.string("name");
      table.string("avatar_url");
      table.integer("public_repos").defaultTo(0);
      table.integer("followers").defaultTo(0);
      table.integer("following").defaultTo(0);
      table.integer("public_gists").defaultTo(0);
      table.string("github_created_at").notNullable();
      table.double("account_age_years").notNullable();
      table.integer("popularity_score").defaultTo(0);
      table.double("followers_per_repo").defaultTo(0.0);
      table.double("repo_per_follower").defaultTo(0.0);
      table.string("created_at").defaultTo(db.fn.now());
      table.string("updated_at").defaultTo(db.fn.now());
    });
    console.log("Database initialized: 'github_profiles' table created.");
  }
} catch (err) {
  console.error("Failed to initialize database:", err);
  throw err;
}

export default db;
