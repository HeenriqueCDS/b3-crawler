import 'dotenv/config'
import knex from 'knex'

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DATABASE_HOST,
    ssl: true,
    port: 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    // database: process.env.DATABASE_NAME, #Optional
  },
})

export { db }
