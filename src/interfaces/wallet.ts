import {Coin} from "./coin";

export interface Wallet {
  name: string;
  wallet: Array<WalletItem>;
}

export interface WalletItem {
  coin: Coin;
  amount: number,
}
