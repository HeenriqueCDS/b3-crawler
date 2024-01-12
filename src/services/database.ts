import 'dotenv/config'
import knex from 'knex'

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DATABASE_HOST,
    ssl: true, // For AWS RDS, deactivate to local database
    port: 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    // database: process.env.DATABASE_NAME, #Optional
  },
})

export { db }
