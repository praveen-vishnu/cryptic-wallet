export interface Coin {
  name: string;
  imageUrl: string;
  currencies: {
    eur: CurrencyData,
    usd: CurrencyData,
    btc: CurrencyData,
  };
}

export interface CurrencyData {
  price: number,
  change: number,
  marketcap: number,
}
