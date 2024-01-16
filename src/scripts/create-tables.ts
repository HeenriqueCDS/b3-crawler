import { db } from '@/services/database'

const createTables = async () => {
  await db.schema.hasTable('quote').then(async (exists) => {
    if (!exists) {
      await db.schema.createTableIfNotExists('quote', (table) => {
        table.string('symbol').primary()
        table.string('currency')
        table.string('shortName')
        table.string('longName')
        table.float('regularMarketPrice')
        table.float('regularMarketChange')
        table.float('regularMarketChangePercent')
        table.string('logoUrl')
        table.date('updatedAt')
        table.float('fiftyTwoWeekLow')
        table.float('fiftyTwoWeekHigh')
        table.float('marketCap')
        table.float('regularMarketVolume')
        table.float('regularMarketOpen')
        table.float('regularMarketDayHigh')
        table.float('regularMarketDayLow')
        table.float('regularMarketPreviousClose')
      })
    }
  })

  await db.schema
    .hasTable('history')
    .then(async (exists) => {
      if (!exists) {
        await db.schema.createTable('history', (table) => {
          table.increments('id').primary()
          table.string('quoteSymbol').references('symbol').inTable('quote')
          table.integer('date')
          table.float('open')
          table.float('high')
          table.float('low')
          table.float('close')
          table.float('volume')
          table.float('adjustedClose')
          table.unique(['quoteSymbol', 'date'])
        })
      }
    })
    .finally(() => {
      db.destroy()
    })
}

createTables()
