import {Coin} from "./coin";

export interface Wallet {
  name: string;
  coins: Array<Coin>;
}
