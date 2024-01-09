export interface HistoricalDataPrice {
  date: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  adjustedClose: number
}

export interface QuoteResult {
  symbol: string
  currency: string
  marketCap: number
  shortName: string
  longName: string
  regularMarketPrice: number
  regularMarketDayHigh: number
  regularMarketDayLow: number
  regularMarketChangePercent: number
  regularMarketVolume: number
  regularMarketPreviousClose: number
  regularMarketOpen: number
  historicalDataPrice: HistoricalDataPrice[]
  fiftyTwoWeekLow: number
  fiftyTwoWeekHigh: number
  logourl: string
  updatedAt: string
}

export interface GetQuoteResponse {
  results: QuoteResult[]
  requestedAt: string
  took: string
}
