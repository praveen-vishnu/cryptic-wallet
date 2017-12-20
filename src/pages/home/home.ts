import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {DemoService} from "../../app/demo.service";
import {InAppBrowser} from "@ionic-native/in-app-browser";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  public coins;

  constructor(public navCtrl: NavController,
              private _demoService: DemoService,
              private iab: InAppBrowser) {

  }

  ngOnInit(): void {
    this.getAllCoins();
  }

  getAllCoins() {
    this._demoService.getCoinList().subscribe(
      data => {
        const coinMarketCoinList = data;
        const baseLinkUrl = coinMarketCoinList['BaseLinkUrl'];
        const baseImageUrl = coinMarketCoinList['BaseImageUrl'];
        const coinListJson = coinMarketCoinList['Data'];

        const coinList = Object.keys(coinListJson).map(coin => {
          const coinObject = coinListJson[coin];
          return {
            name: coinObject['CoinName'],
            url: baseLinkUrl + coinObject['Url'],
            imageUrl: baseImageUrl + coinObject['ImageUrl'],
          };
        });

        this.coins = coinList;
      },
      err => console.error(err),
      () => console.log('done loading coins')
    );
  }

  openLink(url): void {
    this.iab.create(url);
  }

}
