import { HistoricalDataPrice } from '@/types/get-quote.response'

export const historyMapper = (
  symbol: string,
  history: HistoricalDataPrice[],
) => {
  return history.map((item) => {
    return {
      quoteSymbol: symbol,
      date: item.date,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
      adjustedClose: item.adjustedClose,
    }
  })
}
