import {Component} from '@angular/core';
import {CoinListPage} from "./coin-list";

@Component({
  selector: 'page-coin-list-wallet',
  templateUrl: 'coin-list.html',
})
export class CoinListWalletPage extends CoinListPage {
  search: boolean = true;
  coinsSearchList: any;

  selectedCoin(coin) {
    console.log(coin);
    this.navCtrl.pop();
  }

  filterCoins(event) {
    this.coins = this.coinsSearchList;
    let value = event.target.value;

    if (value && value.trim() != '') {
      this.coins = this.coins.filter((item) => {
        return (item.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
      })
    }
  }
}
