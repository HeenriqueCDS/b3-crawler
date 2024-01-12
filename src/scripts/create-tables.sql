-- Create 'quote' table
CREATE TABLE IF NOT EXISTS "quote" (
  "symbol" VARCHAR(255) PRIMARY KEY,
  "currency" VARCHAR(255),
  "shortName" VARCHAR(255),
  "longName" VARCHAR(255),
  "regularMarketPrice" FLOAT,
  "regularMarketChange" FLOAT,
  "regularMarketChangePercent" FLOAT,
  "logoUrl" VARCHAR(255),
  "updatedAt" DATE,
  "fiftyTwoWeekLow" FLOAT,
  "fiftyTwoWeekHigh" FLOAT,
  "marketCap" FLOAT,
  "regularMarketVolume" FLOAT,
  "regularMarketOpen" FLOAT,
  "regularMarketDayHigh" FLOAT,
  "regularMarketDayLow" FLOAT,
  "regularMarketPreviousClose" FLOAT
);

-- Create 'history' table
CREATE TABLE IF NOT EXISTS "history" (
  "id" SERIAL PRIMARY KEY,
  "quoteSymbol" VARCHAR(255) REFERENCES "quote"("symbol"),
  "date" INTEGER UNIQUE,
  "open" FLOAT,
  "high" FLOAT,
  "low" FLOAT,
  "close" FLOAT,
  "volume" FLOAT,
  "adjustedClose" FLOAT
);
