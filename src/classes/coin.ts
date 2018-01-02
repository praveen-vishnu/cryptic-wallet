export interface Coin {
  name: string,
  code: string,
  imageUrl: string,
  order: string,
  currencies: {
    eur: CurrencyData,
    usd: CurrencyData,
    btc: CurrencyData,
  };
  wallet?: {
    amount: number,
    total: number,
  }
}

export interface CurrencyData {
  price: number,
  priceLastUpdated: number,
  change: number,
  marketcap: number,
}
