import { provider } from '@/services/provider'
import { GetQuoteResponse } from '@/types/get-quote.response'
import { AxiosResponse } from 'axios'
import { historyMapper } from '../mappers/history-mapper'
import { tickerMapper } from '../mappers/ticker-mapper'

export const getCompleteQuote = async (symbol: string) => {
  const response: AxiosResponse<GetQuoteResponse> = await provider.get(
    `/quote/${symbol}?range=3mo&interval=1d`,
  )
  const ticker = tickerMapper(response.data.results[0])
  const history = historyMapper(
    ticker.symbol,
    response.data.results[0].historicalDataPrice,
  )

  return { ticker, history }
}
