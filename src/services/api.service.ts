import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Coin} from "../classes/coin";
import {Subscription} from "rxjs/Subscription";

const BATCHSIZE = 10;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'origin, x-csrftoken, content-type, accept',
  })
};

@Injectable()
export class ApiService {
  coinList: Array<Coin>;
  indexStart: number = 0;
  priceObject: Object = {};
  promises = [];
  isLoading: boolean = false;

  static compareNames(a, b) {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  }

  static comparePricesEuro(a, b) {
    if (parseFloat(a.price) > parseFloat(b.price))
      return -1;
    if (parseFloat(a.price) < parseFloat(b.price))
      return 1;
    return 0;
  }

  constructor(private http: HttpClient) {
  }

  callCoinList() {
    return this.http.get('https://min-api.cryptocompare.com/data/all/coinlist');
  }

  callPriceList(coins) {
    return this.http.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coins}&tsyms=BTC,USD,EUR`);
  }

  getCoinList(): Subscription {
    this.isLoading = true;
    return this.callCoinList().subscribe(
      data => {
        const coinMarketCoinList = data;
        const baseImageUrl = coinMarketCoinList['BaseImageUrl'];
        const coinListJson = coinMarketCoinList['Data'];
        let listOfCoinProperties = Object.keys(coinListJson).filter(item => !(item.indexOf('*') > -1));
        if (BATCHSIZE) {
          listOfCoinProperties.length = BATCHSIZE;
        }
        this.iterateThroughCoins(listOfCoinProperties, 60);

        Promise.all(this.promises).then(() => {
          this.coinList = listOfCoinProperties.filter(item => {
            const coinObject = coinListJson[item];
            const hasName = coinObject.hasOwnProperty('CoinName') && !!coinObject['CoinName'];
            const hasUrl = coinObject.hasOwnProperty('Url') && !!coinObject['Url'];
            const hasImage = coinObject.hasOwnProperty('ImageUrl') && !!coinObject['ImageUrl'];
            const hasPrice = this.priceObject[item]
              && (!!this.priceObject[item]['USD']
                && !!this.priceObject[item]['BTC']
                && !!this.priceObject[item]['EUR']);

            return !(!hasName || !hasUrl || !hasImage || !hasPrice);
          }).map(item => {
            const coinObject = coinListJson[item];
            return {
              name: coinObject['CoinName'],
              imageUrl: baseImageUrl + coinObject['ImageUrl'],
              price: this.getPriceInCurrency(item, 'EUR')
            };
          }).sort(ApiService.comparePricesEuro);
          this.isLoading = false;
        }, err => console.error(err));
      },
      err => console.error(err),
      () => console.log('done loading coins')
    );
  }

  getPriceInCurrency(item, currency): string {
    if (this.priceObject[item] && this.priceObject[item][currency]) {
      return this.priceObject[item][currency];
    }
    return 'NOTHING';
  }

  iterateThroughCoins(listOfCoinProperties, batchSize) {
    const range = this.indexStart + batchSize;
    const array = listOfCoinProperties.slice(this.indexStart, range);
    const priceList = this.callPriceList(array.join()).toPromise();

    this.promises.push(new Promise((resolve, reject) => {
      priceList.then(
        data => { // Success
          Object.assign(this.priceObject, data);
          resolve();
        }
      );
    }));

    this.indexStart += batchSize + 1;
    if (range < listOfCoinProperties.length) {
      this.iterateThroughCoins(listOfCoinProperties, batchSize);
    }
  }
}
