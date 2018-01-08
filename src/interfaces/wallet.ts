import {Coin} from "./coin";

export interface Wallet {
  name: string;
  coins: Array<CoinAmount>;
}

export interface CoinAmount {
  coin: Coin;
  amount: number,
}
