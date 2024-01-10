import { provider } from '@/services/provider'
import { GetQuotesResponse } from '@/types/list-quotes.response'
import { AxiosResponse } from 'axios'

const listQuotes = async (page = 1) => {
  const { data } = (await provider.get('/quote/list?limit=10&sortBy=volume', {
    params: {
      page,
    },
  })) as AxiosResponse<GetQuotesResponse>
  const symbols = data.stocks.map((item) => item.stock)
  return symbols
}

export { listQuotes }
