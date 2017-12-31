import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Coin} from "../classes/coin";
import {Subscription} from "rxjs/Subscription";
import {ReplaySubject} from "rxjs/ReplaySubject";

const COINAMOUNT = null;
const BATCHSIZE = 60;

@Injectable()
export class ApiService {
  coinList: Array<Coin>;
  indexStart: number = 0;
  currencyList: Object = {};
  pricePromises = [];
  isLoading: boolean = false;
  refresher: any;
  coinHistoryPriceList = new ReplaySubject(1);
  coinHistoryPriceListJS = new ReplaySubject(1);

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

  static compareOrder(a, b) {
    if (Number(a.order) < Number(b.order))
      return -1;
    if (Number(a.order) > Number(b.order))
      return 1;
    return 0;
  }

  static renderPriceHistory(historyData): any {
    return historyData.map(minuteObject => {
      return {
        name: minuteObject.time,
        value: minuteObject.close
      }
    });
  }

  static renderPriceHistoryChartJSLabel(historyData): any {
    return historyData.map(minuteObject => {
      return minuteObject.time;
    });
  }

  static renderPriceHistoryChartJSValue(historyData): any {
    return historyData.map(minuteObject => {
      return minuteObject.close;
    });
  }

  constructor(private http: HttpClient) {
  }

  private callCoinList() {
    return this.http.get('https://min-api.cryptocompare.com/data/all/coinlist');
  }

  private callPriceList(coins) {
    return this.http.get(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${coins}&tsyms=BTC,USD,EUR&e=CCCAGG`); // TODO: fix currency to dynamic
  }

  getPriceHistoryHour(coin) {
    const code = coin.code;
    const url = this.http.get(`https://min-api.cryptocompare.com/data/histominute?fsym=${code}&tsym=EUR&limit=60&aggregate=1&e=CCCAGG`);
    this.getPriceDataChartJS(url, coin);
  }

  getPriceHistoryDay(coin) {
    const code = coin.code;
    const url = this.http.get(`https://min-api.cryptocompare.com/data/histominute?fsym=${code}&tsym=EUR&limit=1440&aggregate=15&e=CCCAGG`);
    this.getPriceDataChartJS(url, coin);
  }

  getPriceHistoryWeek(coin) {
    const code = coin.code;
    const url = this.http.get(`https://min-api.cryptocompare.com/data/histohour?fsym=${code}&tsym=EUR&limit=168&aggregate=1&e=CCCAGG`);
    this.getPriceDataChartJS(url, coin);
  }

  getPriceHistoryMonth(coin) {
    const code = coin.code;
    const url = this.http.get(`https://min-api.cryptocompare.com/data/histohour?fsym=${code}&tsym=EUR&limit=672&aggregate=12&e=CCCAGG`);
    this.getPriceDataChartJS(url, coin);
  }

  getPriceHistoryYear(coin) {
    const code = coin.code;
    const url = this.http.get(`https://min-api.cryptocompare.com/data/histoday?fsym=${code}&tsym=EUR&limit=365&aggregate=1&e=CCCAGG`);
    this.getPriceDataChartJS(url, coin);
  }

  getPriceHistoryAll(coin) {
    const code = coin.code;
    const url = this.http.get(`https://min-api.cryptocompare.com/data/histoday?fsym=${code}&tsym=EUR&aggregate=1&e=CCCAGG&allData=true`);
    this.getPriceDataChartJS(url, coin);
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
        this.prepareCoinList(listOfCoinProperties, coinListJson, baseImageUrl);
      },
      err => console.error(err),
      () => console.log('done loading coins')
    );
  }

  private prepareCoinList(listOfCoinProperties: string[], coinListJson: any, baseImageUrl: any) {
    Promise.all(this.pricePromises).then(() => {
      this.coinList = listOfCoinProperties.filter(coin => {
        return this.checkForEmptyCoins(coinListJson, coin);
      }).map(coin => {
        return this.mapToCoin(coinListJson, coin, baseImageUrl);
      }).sort(ApiService.compareOrder);
      this.isLoading = false;
      this.indexStart = 0;
      if (this.refresher) {
        this.refresher.complete();
        this.refresher = null;
      }
    }, err => console.error(err));
  }

  private mapToCoin(coinListJson: any, coin, baseImageUrl: any) {
    const coinObject = coinListJson[coin];
    return {
      name: coinObject['CoinName'],
      code: coinObject['Symbol'],
      imageUrl: baseImageUrl + coinObject['ImageUrl'],
      currencies: this.mapCurrencies(coin),
      order: coinObject['SortOrder']
    };
  }

  private checkForEmptyCoins(coinListJson: any, coin) {
    const coinObject = coinListJson[coin];
    const hasName = coinObject.hasOwnProperty('CoinName') && !!coinObject['CoinName'];
    const hasUrl = coinObject.hasOwnProperty('Url') && !!coinObject['Url'];
    const hasImage = coinObject.hasOwnProperty('ImageUrl') && !!coinObject['ImageUrl'];
    const hasPrice = this.currencyList[coin]
      && (!!this.currencyList[coin]['USD']
        && !!this.currencyList[coin]['BTC']
        && !!this.currencyList[coin]['EUR']);
    return hasName && hasUrl && hasImage && hasPrice;
  }

  private getPricesPerBatchSize(listOfCoinProperties, batchSize) {
    const range = this.indexStart + batchSize;
    const shortCoinNames = listOfCoinProperties.slice(this.indexStart, range);
    const priceList = this.callPriceList(shortCoinNames.join()).toPromise();
    this.pricePromises.push(new Promise((resolve, reject) => {
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

  private mapCurrencies(coin): any {
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

  private getPriceData(url, coin) {
    url.subscribe(
      data => {
        const historyData = data['Data'];
        this.coinHistoryPriceList.next([
          {
            "name": coin.name,
            "series": ApiService.renderPriceHistory(historyData)
          },
        ]);
      },
      err => console.error(err),
      () => console.log('done loading coins')
    );
  }

  private getPriceDataChartJS(url, coin) {
    url.subscribe(
      data => {
        const historyData = data['Data'];

        this.coinHistoryPriceListJS.next({
          labels: ApiService.renderPriceHistoryChartJSLabel(historyData),
          data: ApiService.renderPriceHistoryChartJSValue(historyData)
        });
      },
      err => console.error(err),
      () => console.log('done loading coins')
    );
  }
}
