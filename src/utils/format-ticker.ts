import { QuoteResult } from '@/types/get-quote.response'

export const formatTicker = (ticker: QuoteResult) => {
  return {
    symbol: ticker.symbol,
    currency: ticker.currency,
    shortName: ticker.shortName,
    longName: ticker.longName,
    regularMarketPrice: ticker.regularMarketPrice,
    regularMarketChangePercent: ticker.regularMarketChangePercent,
    logoUrl: ticker.logourl,
    updatedAt: ticker.updatedAt,
    fiftyTwoWeekLow: ticker.fiftyTwoWeekLow,
    fiftyTwoWeekHigh: ticker.fiftyTwoWeekHigh,
    marketCap: ticker.marketCap,
    regularMarketVolume: ticker.regularMarketVolume,
    regularMarketOpen: ticker.regularMarketOpen,
    regularMarketDayHigh: ticker.regularMarketDayHigh,
    regularMarketDayLow: ticker.regularMarketDayLow,
    regularMarketPreviousClose: ticker.regularMarketPreviousClose,
  }
}
