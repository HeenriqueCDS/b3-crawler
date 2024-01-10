export interface Index {
  stock: string
  name: string
}

export interface Stock {
  stock: string
  name: string
  close: number
  change: number
  volume: number
  market_cap?: number
  logo: string
  sector?: string
  type: string
}

export interface GetQuotesResponse {
  indexes: Index[]
  stocks: Stock[]
  availableSectors: string[]
  availableStockTypes: string[]
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalCount: number
  hasNextPage: boolean
}
