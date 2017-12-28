import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Coin} from "../classes/coin";
import {Subscription} from "rxjs/Subscription";

const COINAMOUNT = null;
const BATCHSIZE = 60;

@Injectable()
export class ApiService {
  coinList: Array<Coin>;
  indexStart: number = 0;
  currencyList: Object = {};
  promises = [];
  isLoading: boolean = false;
  refresher: any;
  coinHistoryPriceList: Array<Object> = null;

  static compareNames(a, b) {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  }

  static comparePrices(a, b) {
    if (parseFloat(a.currencies.eur.price) > parseFloat(b.currencies.eur.price))
      return -1;
    if (parseFloat(a.currencies.eur.price) < parseFloat(b.currencies.eur.price))
      return 1;
    return 0;
  }

  constructor(private http: HttpClient) {
  }

  callCoinList() {
    return this.http.get('https://min-api.cryptocompare.com/data/all/coinlist');
  }

  callPriceList(coins) {
    return this.http.get(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${coins}&tsyms=BTC,USD,EUR&e=CCCAGG`); // TODO: fix currency to dynamic
  }

  getPriceHistoryHour(coin) {
    const code = coin.code;
    const url = this.http.get(`https://min-api.cryptocompare.com/data/histominute?fsym=${code}&tsym=EUR&limit=60&aggregate=1&e=CCCAGG`);
    return this.getPriceData(url, coin);
  }

  getPriceHistoryDay(coin) {
    const code = coin.code;
    const url = this.http.get(`https://min-api.cryptocompare.com/data/histohour?fsym=${code}&tsym=EUR&limit=24&aggregate=1&e=CCCAGG`);
    this.getPriceData(url, coin);
  }

  getPriceHistoryMonth(coin) {
    const code = coin.code;
    const url = this.http.get(`https://min-api.cryptocompare.com/data/histoday?fsym=${code}&tsym=EUR&limit=30&aggregate=1&e=CCCAGG`);
    this.getPriceData(url, coin);
  }

  getPriceHistoryYear(coin) {
    const code = coin.code;
    const url = this.http.get(`https://min-api.cryptocompare.com/data/histoday?fsym=${code}&tsym=EUR&limit=365&aggregate=1&e=CCCAGG`);
    this.getPriceData(url, coin);
  }

  getPriceHistoryAll(coin) {
    const code = coin.code;
    const url = this.http.get(`https://min-api.cryptocompare.com/data/histoday?fsym=${code}&tsym=EUR&limit=3650&aggregate=1&e=CCCAGG`);
    this.getPriceData(url, coin);
  }

  getCoinList(): Subscription {
    if (!this.refresher) {
      this.isLoading = true;
    }
    return this.callCoinList().subscribe(
      data => {
        const coinMarketCoinList = data;
        const baseImageUrl = coinMarketCoinList['BaseImageUrl'];
        const coinListJson = coinMarketCoinList['Data'];
        let listOfCoinProperties = Object.keys(coinListJson).filter(coin => !(coin.indexOf('*') > -1));
        if (COINAMOUNT) {
          listOfCoinProperties.length = COINAMOUNT;
        }
        this.getPricesPerBatchSize(listOfCoinProperties, BATCHSIZE);
        Promise.all(this.promises).then(() => {
          this.coinList = listOfCoinProperties.filter(coin => {
            const coinObject = coinListJson[coin];
            const hasName = coinObject.hasOwnProperty('CoinName') && !!coinObject['CoinName'];
            const hasUrl = coinObject.hasOwnProperty('Url') && !!coinObject['Url'];
            const hasImage = coinObject.hasOwnProperty('ImageUrl') && !!coinObject['ImageUrl'];
            const hasPrice = this.currencyList[coin]
              && (!!this.currencyList[coin]['USD']
                && !!this.currencyList[coin]['BTC']
                && !!this.currencyList[coin]['EUR']);
            return hasName && hasUrl && hasImage && hasPrice;
          }).map(coin => {
            const coinObject = coinListJson[coin];
            return {
              name: coinObject['CoinName'],
              code: coinObject['Symbol'],
              imageUrl: baseImageUrl + coinObject['ImageUrl'],
              currencies: this.getCurrencies(coin)
            };
          }).sort(ApiService.comparePrices);
          this.isLoading = false;
          this.indexStart = 0;
          if (this.refresher) {
            this.refresher.complete();
            this.refresher = null;
          }
        }, err => console.error(err));
      },
      err => console.error(err),
      () => console.log('done loading coins')
    );
  }

  getPricesPerBatchSize(listOfCoinProperties, batchSize) {
    const range = this.indexStart + batchSize;
    const shortCoinNames = listOfCoinProperties.slice(this.indexStart, range);
    const priceList = this.callPriceList(shortCoinNames.join()).toPromise();
    this.promises.push(new Promise((resolve, reject) => {
      priceList.then(
        data => {
          Object.assign(this.currencyList, data['RAW']);
          resolve();
        }
      );
    }));

    this.indexStart += batchSize + 1;
    if (range < listOfCoinProperties.length) {
      this.getPricesPerBatchSize(listOfCoinProperties, batchSize);
    }
  }

  getCurrencies(coin): any {
    if (this.currencyList[coin]) {
      const currencies = this.currencyList[coin];

      for (let currency in currencies) {
        if (currencies.hasOwnProperty(currency)) {
          currencies[currency] = {
            price: currencies[currency]['PRICE'],
            change: currencies[currency]['CHANGEPCT24HOUR'],
            marketcap: currencies[currency]['MKTCAP'],
          };

          if (currency !== currency.toLocaleLowerCase()) {
            Object.defineProperty(currencies, currency.toLocaleLowerCase(), Object.getOwnPropertyDescriptor(currencies, currency));
            delete currencies[currency];
          }
        }
      }
      return currencies;
    }
  }

  refreshCoinList(refresher) {
    this.refresher = refresher;
    setTimeout(() => this.getCoinList(), 1000);
  }

  getPriceData(url, coin) {
    url.subscribe(
      data => {
        const historyData = data['Data'];

        this.coinHistoryPriceList = [
          {
            "name": coin.name,
            "series": ApiService.renderPriceHistory(historyData)
          },
        ];

        console.log('list: ', this.coinHistoryPriceList);
      },
      err => console.error(err),
      () => console.log('done loading coins')
    );
  }

  static renderPriceHistory(historyData): any {
    return historyData.map(minuteObject => {
      return {
        name: minuteObject.time,
        value: minuteObject.close
      }
    });
  }
}
