webpackJsonp([0],{

/***/ 129:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PipesModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__number_formatter_number_formatter__ = __webpack_require__(565);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var PipesModule = (function () {
    function PipesModule() {
    }
    PipesModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            declarations: [__WEBPACK_IMPORTED_MODULE_1__number_formatter_number_formatter__["a" /* NumberFormatterPipe */]],
            imports: [],
            exports: [__WEBPACK_IMPORTED_MODULE_1__number_formatter_number_formatter__["a" /* NumberFormatterPipe */]]
        })
    ], PipesModule);
    return PipesModule;
}());

//# sourceMappingURL=pipes.module.js.map

/***/ }),

/***/ 163:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CoinListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_api_service__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__coin_details_coin_details__ = __webpack_require__(249);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__classes_comparison_utils__ = __webpack_require__(854);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_websocket_service__ = __webpack_require__(164);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var SORTERS = [
    {
        name: 'Popular',
        value: 'popular'
    },
    {
        name: 'Price',
        value: 'price'
    },
    {
        name: 'Market Cap',
        value: 'marketcap'
    },
];
var CoinListPage = (function () {
    function CoinListPage(navCtrl, navParams, storage, websocketService, apiService) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.websocketService = websocketService;
        this.apiService = apiService;
        this.search = false;
        this.coins = [];
        this.favorites = [];
        this.list = [];
        this.sorters = SORTERS;
        this.listLoaded = false;
        this.searchTerm = '';
        this.subscriptionToSocket = false;
        this.apiService.coinList.subscribe(function (coinList) {
            _this.coins = _this.removeFavorites(coinList);
            if (_this.isCoinsView()) {
                _this.list = _this.coins;
            }
            _this.sortList(_this.sorter);
            _this.storage.set('coin-list', coinList);
        });
    }
    CoinListPage.prototype.ionViewDidLoad = function () {
        this.listView = 'favorites';
        this.list = this.favorites;
        this.retrieveFavoritesFromStorage();
        this.retrieveSorterFromStorage();
    };
    CoinListPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        if (this.subscriptionToSocket && !this.isCoinsView()) {
            this.websocketService.watchEvent(function (updatedCoin) {
                _this.watchCoinUpdate(updatedCoin);
            });
        }
    };
    CoinListPage.prototype.ionViewDidLeave = function () {
        this.websocketService.stopWatchEvent();
    };
    Object.defineProperty(CoinListPage.prototype, "listIsEmpty", {
        get: function () {
            if (this.listLoaded) {
                return !this.isCoinsView() && this.list.length === 0;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    CoinListPage.prototype.goToAllCoins = function () {
        var _this = this;
        this.listView = 'coins';
        this.delayedAnimation = setTimeout(function () {
            _this.openItemAnimated(_this.itemSlidings.first, _this.itemSlidings.first.item);
        }, 1500);
    };
    CoinListPage.prototype.retrieveSorterFromStorage = function () {
        var _this = this;
        this.storage.get('sorter').then(function (sorter) {
            sorter ? _this.sorter = sorter : _this.sorter = 'popular';
        });
    };
    CoinListPage.prototype.retrieveFavoritesFromStorage = function () {
        var _this = this;
        this.storage.get('favorites').then(function (list) {
            list ? _this.list = _this.favorites = list : [];
            _this.sortList(_this.sorter);
            _this.subscribeFavoritesToSocket();
            _this.retrieveCoinsFromStorage();
        });
    };
    CoinListPage.prototype.subscribeFavoritesToSocket = function () {
        var _this = this;
        this.subscriptionToSocket = this.websocketService.subscribeToSocket(this.favorites);
        this.websocketService.watchEvent(function (updatedCoin) {
            _this.watchCoinUpdate(updatedCoin);
        });
    };
    CoinListPage.prototype.watchCoinUpdate = function (updatedCoin) {
        var listItem = this.itemSlidings.find(function (item) {
            if (item.item.getLabelText().trim()) {
                var name_1 = item.item.getLabelText().trim();
                return name_1 === updatedCoin.name;
            }
            return false;
        });
        if (listItem) {
            listItem.item.getNativeElement().classList.add('ping');
            setTimeout(function () {
                listItem.item.getNativeElement().classList.remove('ping');
            }, 750);
        }
        this.sortList(this.sorter);
    };
    CoinListPage.prototype.retrieveCoinsFromStorage = function () {
        var _this = this;
        this.storage.get('coin-list').then(function (list) {
            if (list) {
                list = _this.removeFavorites(list);
                _this.coins = list;
                _this.sortList(_this.sorter);
            }
            else {
                _this.apiService.getCoinList();
            }
            _this.listLoaded = true;
        });
    };
    CoinListPage.prototype.removeFavorites = function (list) {
        var _this = this;
        return list.filter(function (coin) {
            return !_this.favorites.some(function (favorite) { return favorite.name === coin.name; });
        });
    };
    CoinListPage.prototype.isCoinsView = function () {
        return this.listView === 'coins';
    };
    CoinListPage.prototype.filterCoinsOnSearch = function (event) {
        this.coinsSearchList = this.coins;
        var value = event.target.value;
        if (value && value.trim() != '') {
            this.list = this.coinsSearchList.filter(function (item) {
                return (item.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
            });
        }
        else {
            this.list = this.coins;
        }
    };
    CoinListPage.prototype.listHasCoins = function () {
        return this.list.length > 0 ? 'visible' : 'hidden';
    };
    CoinListPage.prototype.sorterChanged = function (event) {
        this.sortList(event);
        this.storage.set('sorter', event);
    };
    CoinListPage.prototype.listChanged = function (event) {
        var _this = this;
        this.list = [];
        this.updateVirtualList(function () {
            switch (event.value) {
                case 'favorites':
                    _this.list = _this.favorites;
                    if (_this.delayedAnimation) {
                        clearTimeout(_this.delayedAnimation);
                    }
                    _this.websocketService.watchEvent(function (updatedCoin) {
                        _this.watchCoinUpdate(updatedCoin);
                    });
                    break;
                case 'coins':
                    _this.list = _this.coins;
                    _this.websocketService.stopWatchEvent();
                    break;
                default:
                    _this.list = _this.coins;
                    _this.websocketService.stopWatchEvent();
                    break;
            }
        });
        this.sortList(this.sorter);
        this.content.scrollToTop();
    };
    CoinListPage.prototype.updateVirtualList = function (callBack) {
        this.virtualList.writeUpdate(true);
        callBack();
        this.virtualList.renderVirtual(true);
        this.virtualList.readUpdate(true);
        this.virtualList.resize();
    };
    CoinListPage.prototype.openItemAnimated = function (itemSlide, item) {
        itemSlide.setElementClass("active-sliding", true);
        itemSlide.setElementClass("active-slide", true);
        itemSlide.setElementClass("active-options-right", true);
        item.setElementStyle("transform", "translate3d(-80px, 0px, 0px)");
        setTimeout(function () {
            itemSlide.close();
        }, 1000);
    };
    CoinListPage.prototype.sortList = function (sorter) {
        switch (sorter) {
            case 'popular':
                this.list.sort(__WEBPACK_IMPORTED_MODULE_5__classes_comparison_utils__["a" /* ComparisonUtils */].compareOrder);
                break;
            case 'price':
                this.list.sort(__WEBPACK_IMPORTED_MODULE_5__classes_comparison_utils__["a" /* ComparisonUtils */].comparePrices);
                break;
            case 'marketcap':
                this.list.sort(__WEBPACK_IMPORTED_MODULE_5__classes_comparison_utils__["a" /* ComparisonUtils */].compareMarketCap);
                break;
            default:
                this.list.sort(__WEBPACK_IMPORTED_MODULE_5__classes_comparison_utils__["a" /* ComparisonUtils */].compareOrder);
                break;
        }
    };
    Object.defineProperty(CoinListPage.prototype, "coinListLength", {
        get: function () {
            return this.coins ? this.coins.length.toString() : '0';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoinListPage.prototype, "isLoading", {
        get: function () {
            return this.apiService.isLoading;
        },
        enumerable: true,
        configurable: true
    });
    CoinListPage.prototype.selectedCoin = function (coin) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__coin_details_coin_details__["a" /* CoinDetailsPage */], coin);
    };
    CoinListPage.prototype.trackByCoin = function (index, item) {
        return item.name;
    };
    CoinListPage.prototype.detectChange = function (priceChange) {
        return priceChange < 0;
    };
    CoinListPage.prototype.doRefresh = function (refresher) {
        this.apiService.refreshCoinList(refresher);
    };
    CoinListPage.prototype.addToFavorites = function (item, coin) {
        var _this = this;
        this.favorites.push(coin);
        this.websocketService.subscribeCoinToSocket(coin);
        this.storage.set('favorites', this.favorites);
        this.list = [];
        this.updateVirtualList(function () {
            _this.list = _this.coins = _this.coins.filter(function (item) { return item.name !== coin.name; });
        });
        item.close();
        this.searchTerm = '';
    };
    CoinListPage.prototype.removeFromFavorites = function (item, coin) {
        var index = this.favorites.indexOf(coin);
        if (index > -1) {
            this.favorites.splice(index, 1);
        }
        this.storage.set('favorites', this.favorites);
        this.coins.push(coin);
        if (this.favorites.length > 0) {
            this.websocketService.unsubscribeCoinToSocket(coin);
        }
        else {
            this.websocketService.stopWatchEvent();
        }
        item.close();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* VirtualScroll */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* VirtualScroll */])
    ], CoinListPage.prototype, "virtualList", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Content */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Content */])
    ], CoinListPage.prototype, "content", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChildren"])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* ItemSliding */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["QueryList"])
    ], CoinListPage.prototype, "itemSlidings", void 0);
    CoinListPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-coin-list',template:/*ion-inline-start:"/Users/elvis/coding/crypto/src/pages/coin-list/coin-list.html"*/'<ion-header no-border>\n  <ion-navbar>\n    <ion-title>\n      <ng-container *ngIf="!search; else wallet">\n        Cryptic\n      </ng-container>\n      <ng-template #wallet>\n        Choose your coin\n      </ng-template>\n    </ion-title>\n  </ion-navbar>\n  <ion-toolbar>\n    <ion-segment [(ngModel)]="listView" (ionChange)="listChanged($event)">\n      <ion-segment-button class="button-skewed" value="favorites" [ngClass]="{\'active\': listView === \'favorites\'}">\n        Favorites\n      </ion-segment-button>\n      <ion-segment-button class="button-skewed--inverse" value="coins" [ngClass]="{\'active\': listView === \'coins\'}">\n        All coins\n      </ion-segment-button>\n    </ion-segment>\n  </ion-toolbar>\n  <ion-toolbar class="sort-custom">\n    <ion-grid>\n      <ion-row>\n        <ion-col>\n        </ion-col>\n        <ion-col>\n          <ion-select\n            [style.visibility]="listHasCoins()"\n            [(ngModel)]="sorter"\n            [interface]="\'action-sheet\'"\n            (ionChange)="sorterChanged($event)">\n            <ion-option #item *ngFor="let sorter of sorters" [value]="sorter.value">{{sorter.name}}</ion-option>\n          </ion-select>\n        </ion-col>\n      </ion-row>\n    </ion-grid>\n\n  </ion-toolbar>\n</ion-header>\n\n<ion-content>\n  <ion-spinner class="big-loader" name="crescent" *ngIf="isCoinsView() && isLoading"></ion-spinner>\n  <ion-refresher *ngIf="isCoinsView()" (ionRefresh)="doRefresh($event)">\n    <ion-refresher-content pullingText="Pull to refresh"\n                           refreshingSpinner="crescent"\n                           refreshingText="Refreshing..."></ion-refresher-content>\n  </ion-refresher>\n  <ion-searchbar [(ngModel)]="searchTerm" *ngIf="isCoinsView()"\n                 (ionInput)="filterCoinsOnSearch($event)"></ion-searchbar>\n  <ion-list [virtualScroll]="list" [approxItemHeight]="\'70px\'"\n            [approxItemWidth]="\'100%\'" [virtualTrackBy]="trackByCoin" no-lines>\n    <ion-item-sliding #slidingItem *virtualItem="let coin">\n      <button ion-item #item (click)="selectedCoin(coin)" [ngClass]="{\'favorite\': coin.favorite}" detail-none>\n        <ion-avatar class="logo" item-start>\n          <img-loader [src]="coin.imageUrl" useImg></img-loader>\n        </ion-avatar>\n        <ion-label>\n          {{coin.name}}\n        </ion-label>\n        <span item-right class="price">\n          <span>{{coin.currency.symbol}} {{coin.price| numberFormatter: \'price\'}}</span>\n        </span>\n        <div class="change-icon" item-end>\n          <svg\n            viewBox="0 0 13 11"\n            class="delta"\n            [ngClass]="{\'negative\' : detectChange(coin.change)}"\n            version="1.1" xmlns="http://www.w3.org/2000/svg"\n          >\n            <title>Triangle</title>\n            <defs></defs>\n            <g id="Coin-row" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"\n               transform="translate(-344.000000, -41.000000)">\n              <polygon id="Triangle" stroke="#4EB92E" stroke-width="2" points="350.5 43 355 51 346 51"></polygon>\n            </g>\n          </svg>\n        </div>\n      </button>\n      <ion-item-options>\n        <button *ngIf="isCoinsView()" ion-button color="tertiary" (click)="addToFavorites(slidingItem, coin)">\n          Favorite\n        </button>\n        <button *ngIf="!isCoinsView()" ion-button color="danger" (click)="removeFromFavorites(slidingItem, coin)">\n          Remove\n        </button>\n      </ion-item-options>\n    </ion-item-sliding>\n  </ion-list>\n\n\n  <div *ngIf="listIsEmpty" class="empty-list" text-center padding>\n    <img src="./assets/imgs/pin.svg" alt="pin">\n    <button ion-button full color="tertiary" (click)="goToAllCoins()">Select your coins</button>\n  </div>\n</ion-content>\n'/*ion-inline-end:"/Users/elvis/coding/crypto/src/pages/coin-list/coin-list.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */],
            __WEBPACK_IMPORTED_MODULE_6__services_websocket_service__["a" /* WebsocketService */],
            __WEBPACK_IMPORTED_MODULE_2__services_api_service__["a" /* ApiService */]])
    ], CoinListPage);
    return CoinListPage;
}());

//# sourceMappingURL=coin-list.js.map

/***/ }),

/***/ 164:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WebsocketService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng_socket_io__ = __webpack_require__(440);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng_socket_io___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ng_socket_io__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__classes_cryptocompare_utils__ = __webpack_require__(877);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var TYPE = __WEBPACK_IMPORTED_MODULE_2__classes_cryptocompare_utils__["a" /* CCC */].STATIC.TYPE['CURRENTAGG'];
var EXCHANGE = 'CCCAGG';
var WebsocketService = (function () {
    function WebsocketService(socket) {
        this.socket = socket;
        this.subscribers = [];
        this.currentPrice = {};
    }
    WebsocketService.prototype.subscribeToSocket = function (subscribers) {
        this.subscribers = subscribers;
        var subscriptions = [];
        this.subscribers.forEach(function (coin) {
            subscriptions.push(TYPE + "~" + EXCHANGE + "~" + coin.code + "~" + coin.currency.code);
        });
        this.socket.emit('SubAdd', { subs: subscriptions });
        return true;
    };
    WebsocketService.prototype.subscribeCoinToSocket = function (coin) {
        this.socket.emit('SubAdd', { subs: [TYPE + "~" + EXCHANGE + "~" + coin.code + "~" + coin.currency.code] });
    };
    WebsocketService.prototype.unsubscribeCoinToSocket = function (coin) {
        this.socket.emit('SubRemove', { subs: [TYPE + "~" + EXCHANGE + "~" + coin.code + "~" + coin.currency.code] });
    };
    WebsocketService.prototype.stopWatchEvent = function () {
        this.watchEventSubscription.unsubscribe();
    };
    WebsocketService.prototype.watchEvent = function (callback) {
        var _this = this;
        this.watchEventSubscription = this.socket.fromEvent('m').subscribe(function (message) {
            var messageType = message.substring(0, message.indexOf("~"));
            var res = {};
            if (messageType == __WEBPACK_IMPORTED_MODULE_2__classes_cryptocompare_utils__["a" /* CCC */].STATIC.TYPE.CURRENTAGG) {
                res = __WEBPACK_IMPORTED_MODULE_2__classes_cryptocompare_utils__["a" /* CCC */].CURRENT.unpack(message);
                _this.dataUnpack(res, callback);
            }
        }, function (data) {
            // TODO: Check what to do if there is no subscription data
            console.log('error: ', data);
        });
    };
    WebsocketService.prototype.dataUnpack = function (data, callback) {
        var from = data['FROMSYMBOL'];
        var to = data['TOSYMBOL'];
        var fsym = __WEBPACK_IMPORTED_MODULE_2__classes_cryptocompare_utils__["a" /* CCC */].STATIC.CURRENCY.getSymbol(from);
        var tsym = __WEBPACK_IMPORTED_MODULE_2__classes_cryptocompare_utils__["a" /* CCC */].STATIC.CURRENCY.getSymbol(to);
        var pair = from + to;
        if (!this.currentPrice.hasOwnProperty(pair)) {
            this.currentPrice[pair] = {};
        }
        for (var key in data) {
            this.currentPrice[pair][key] = data[key];
        }
        if (this.currentPrice[pair]['LASTTRADEID']) {
            this.currentPrice[pair]['LASTTRADEID'] = parseInt(this.currentPrice[pair]['LASTTRADEID']).toFixed(0);
        }
        this.currentPrice[pair]['CHANGE24HOUR'] = __WEBPACK_IMPORTED_MODULE_2__classes_cryptocompare_utils__["a" /* CCC */].convertValueToDisplay(tsym, (this.currentPrice[pair]['PRICE'] - this.currentPrice[pair]['OPEN24HOUR']));
        this.currentPrice[pair]['CHANGE24HOURPCT'] = ((this.currentPrice[pair]['PRICE'] - this.currentPrice[pair]['OPEN24HOUR']) / this.currentPrice[pair]['OPEN24HOUR'] * 100).toFixed(2) + "%";
        this.displayData(this.currentPrice[pair], from, tsym, fsym, callback);
    };
    ;
    WebsocketService.prototype.displayData = function (current, from, tsym, fsym, callback) {
        var priceDirection = current.FLAGS;
        // for (let key in current) {
        //   if (key == 'CHANGE24HOURPCT') {
        //     // $('#' + key + '_' + from).text(' (' + current[key] + ')');
        //     console.log(current[key]);
        //   }
        //   // else if (key == 'LASTVOLUMETO' || key == 'VOLUME24HOURTO') {
        //   //   $('#' + key + '_' + from).text(CCC.convertValueToDisplay(tsym, current[key]));
        //   // }
        //   // else if (key == 'LASTVOLUME' || key == 'VOLUME24HOUR' || key == 'OPEN24HOUR' || key == 'OPENHOUR' || key == 'HIGH24HOUR' || key == 'HIGHHOUR' || key == 'LOWHOUR' || key == 'LOW24HOUR') {
        //   //   $('#' + key + '_' + from).text(CCC.convertValueToDisplay(fsym, current[key]));
        //   // }
        //   // else {
        //   //   $('#' + key + '_' + from).text(current[key]);
        //   // }
        // }
        //
        // // $('#PRICE_' + from).removeClass();
        // if (priceDirection & 1) {
        //   console.log('up');
        //   // $('#PRICE_' + from).addClass("up");
        // }
        // else if (priceDirection & 2) {
        //   console.log('down');
        //   // $('#PRICE_' + from).addClass("down");
        // }
        // if (current['PRICE'] > current['OPEN24HOUR']) {
        //   console.log('price up');
        //   // $('#CHANGE24HOURPCT_' + from).removeClass();
        //   // $('#CHANGE24HOURPCT_' + from).addClass("up");
        // }
        // else if (current['PRICE'] < current['OPEN24HOUR']) {
        //   console.log('price down');
        //
        //   // $('#CHANGE24HOURPCT_' + from).removeClass();
        //   // $('#CHANGE24HOURPCT_' + from).addClass("down");
        // }
        var coinCode = current['FROMSYMBOL'];
        var coin = this.subscribers.find(function (item) { return item.code === coinCode; });
        if (coin) {
            var index = this.subscribers.indexOf(coin);
            if (index > -1) {
                for (var key in current) {
                    if (key == 'CHANGE24HOURPCT') {
                        this.subscribers[index].change = Number(current[key].replace('%', ''));
                    }
                    if (key == 'PRICE') {
                        this.subscribers[index].price = Number(current['PRICE']);
                    }
                    if (key == 'LASTUPDATE') {
                        this.subscribers[index].priceLastUpdated = Number(current['LASTUPDATE']);
                    }
                }
            }
            // console.log(coin.name + ' : ' + coin.change);
            // console.log(coin.name + ' : ' + coin.price);
            // console.log(coin.name + ' : ' + coin.priceLastUpdated);
            callback(coin);
        }
    };
    ;
    WebsocketService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ng_socket_io__["Socket"]])
    ], WebsocketService);
    return WebsocketService;
}());

//# sourceMappingURL=websocket.service.js.map

/***/ }),

/***/ 205:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 205;

/***/ }),

/***/ 247:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/coin-details/coin-details.module": [
		248
	],
	"../pages/coin-list/coin-list.module": [
		439
	],
	"../pages/settings/settings.module": [
		460
	],
	"../pages/tabs/tabs.module": [
		462
	],
	"../pages/wallet-edit/wallet-edit.module": [
		466
	],
	"../pages/wallet/wallet.module": [
		467
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return Promise.all(ids.slice(1).map(__webpack_require__.e)).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 247;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 248:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CoinDetailsPageModule", function() { return CoinDetailsPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__coin_details__ = __webpack_require__(249);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pipes_pipes_module__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_components_module__ = __webpack_require__(372);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var CoinDetailsPageModule = (function () {
    function CoinDetailsPageModule() {
    }
    CoinDetailsPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__coin_details__["a" /* CoinDetailsPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__coin_details__["a" /* CoinDetailsPage */]),
                __WEBPACK_IMPORTED_MODULE_3__pipes_pipes_module__["a" /* PipesModule */],
                __WEBPACK_IMPORTED_MODULE_4__components_components_module__["a" /* ComponentsModule */],
            ],
        })
    ], CoinDetailsPageModule);
    return CoinDetailsPageModule;
}());

//# sourceMappingURL=coin-details.module.js.map

/***/ }),

/***/ 249:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CoinDetailsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_api_service__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_moment__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var CoinDetailsPage = (function () {
    function CoinDetailsPage(navCtrl, navParams, apiService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.apiService = apiService;
        this.coin = navParams.data;
        // this.overrideCoin();
        if (this.coin) {
            this.price = this.coin.price;
            //TODO the current date probably doesn't correspond with the last retrieved price date
            this.priceDate = this.currentDate = __WEBPACK_IMPORTED_MODULE_3_moment__["unix"](this.coin.price).format("DD-MM-YYYY HH:mm");
        }
    }
    CoinDetailsPage.prototype.subscribePriceHistoryDataNGX = function () {
        var _this = this;
        this.apiService.coinHistoryPriceListJS.subscribe(function (value) {
            if (!!value) {
                _this.data = value;
            }
        });
    };
    CoinDetailsPage.prototype.subscribePriceHistoryData = function () {
        var _this = this;
        this.apiService.coinHistoryPriceListJS.subscribe(function (value) {
            if (!!value) {
                _this.data = value;
            }
        });
    };
    CoinDetailsPage.prototype.overrideCoin = function () {
        this.coin = {
            name: 'Bitcoin',
            code: 'BTC',
            imageUrl: 'https://www.cryptocompare.com/media/19633/btc.png',
            order: '1',
            currency: {
                name: 'Euro',
                code: 'EUR',
                symbol: '€'
            },
            price: 12965.69,
            priceLastUpdated: 1514827291,
            change: 27.148140048699126,
            marketcap: 217286164149.5
        };
    };
    CoinDetailsPage.prototype.ionViewDidEnter = function () {
        this.chartMode = 'day';
        this.subscribePriceHistoryData();
        this.apiService.getPriceHistoryDay(this.coin);
    };
    CoinDetailsPage.prototype.ionViewDidLeave = function () {
        this.apiService.coinHistoryPriceListJS.next(null);
        this.data = null;
    };
    Object.defineProperty(CoinDetailsPage.prototype, "calculateChartHeight", {
        get: function () {
            var heightNumber = this.segment.nativeElement.clientHeight + this.timestamp.nativeElement.clientHeight;
            return "calc(100% - " + heightNumber + "px)";
        },
        enumerable: true,
        configurable: true
    });
    CoinDetailsPage.prototype.detectChange = function (priceChange) {
        return priceChange < 0;
    };
    CoinDetailsPage.prototype.chartModeChanged = function (event) {
        this.data = null;
        switch (this.chartMode) {
            case 'day':
                this.apiService.coinHistoryPriceList = null;
                this.apiService.getPriceHistoryDay(this.coin);
                break;
            case 'week':
                this.apiService.coinHistoryPriceList = null;
                this.apiService.getPriceHistoryWeek(this.coin);
                break;
            case 'month':
                this.apiService.coinHistoryPriceList = null;
                this.apiService.getPriceHistoryMonth(this.coin);
                break;
            case 'year':
                this.apiService.coinHistoryPriceList = null;
                this.apiService.getPriceHistoryYear(this.coin);
                break;
            case 'all':
                this.apiService.coinHistoryPriceList = null;
                this.apiService.getPriceHistoryAll(this.coin);
                break;
            default:
                this.apiService.coinHistoryPriceList = null;
                this.apiService.getPriceHistoryDay(this.coin);
        }
    };
    CoinDetailsPage.prototype.updatePrice = function (value) {
        if (!!value) {
            this.coin.price = value;
        }
        else {
            this.coin.price = this.price;
        }
    };
    CoinDetailsPage.prototype.updateDate = function (value) {
        if (!!value) {
            this.priceDate = value;
        }
        else {
            this.priceDate = this.currentDate;
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('segment'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"])
    ], CoinDetailsPage.prototype, "segment", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('timestamp'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"])
    ], CoinDetailsPage.prototype, "timestamp", void 0);
    CoinDetailsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-coin-details',template:/*ion-inline-start:"/Users/elvis/coding/crypto/src/pages/coin-details/coin-details.html"*/'<ion-header no-border>\n  <ion-navbar>\n    <ion-title text-center>\n      <div class="logo logo--header">\n        <img [src]="coin.imageUrl">\n      </div>\n    </ion-title>\n  </ion-navbar>\n  <ion-toolbar class="toolbar-header">\n    <div class="coin-price" text-center>\n      <div class="price">\n        <div class="currency">\n          <span class="currency__symbol">{{coin.currency.symbol}}</span>\n          <span class="currency__number">{{coin.price | numberFormatter: \'price\'}}</span>\n        </div>\n      </div>\n    </div>\n  </ion-toolbar>\n  <ion-toolbar class="toolbar-header">\n    <ion-grid class="grid-skewed">\n      <ion-row>\n        <ion-col col-6 class="grid-skewed_first">\n          <ion-label>\n            {{coin.name}}\n          </ion-label>\n        </ion-col>\n        <ion-col col-6 class="grid-skewed_last">\n          <!-- TODO: fix formatting -->\n          <div text-center class="price-change" [ngClass]="{\'negative\' : detectChange(coin.change)}">\n            <svg\n              viewBox="0 0 13 11"\n              class="delta"\n              [ngClass]="{\'negative\' : detectChange(coin.change)}"\n              version="1.1" xmlns="http://www.w3.org/2000/svg"\n            >\n              <title>Triangle</title>\n              <defs></defs>\n              <g id="Coin-row" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"\n                 transform="translate(-344.000000, -41.000000)">\n                <polygon id="Triangle" stroke="#4EB92E" stroke-width="2" points="350.5 43 355 51 346 51"></polygon>\n              </g>\n            </svg>\n            <div class="percentage">\n              <span class="percentage__number">{{coin.change | numberFormatter: \'perc\'}}</span>\n              <span class="percentage__symbol">%</span>\n            </div>\n          </div>\n        </ion-col>\n      </ion-row>\n    </ion-grid>\n  </ion-toolbar>\n  <ion-toolbar class="toolbar-header">\n    <ion-grid class="coin-market-cap">\n      <ion-row>\n        <ion-col>\n          <small>\n            Market cap\n          </small>\n        </ion-col>\n        <ion-col text-right>\n          <small>\n            {{coin.currency.symbol}} {{coin.marketcap | numberFormatter}}\n          </small>\n        </ion-col>\n      </ion-row>\n    </ion-grid>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content>\n  <div #segment class="chart-segment">\n    <ion-segment [(ngModel)]="chartMode" (ionChange)="chartModeChanged($event)">\n      <ion-segment-button value="day">\n        D\n      </ion-segment-button>\n      <ion-segment-button value="week">\n        W\n      </ion-segment-button>\n      <ion-segment-button value="month">\n        M\n      </ion-segment-button>\n      <ion-segment-button value="year">\n        Y\n      </ion-segment-button>\n      <ion-segment-button value="all">\n        All\n      </ion-segment-button>\n    </ion-segment>\n  </div>\n  <div #timestamp class="chart-timestamp" text-center><span class="date">{{priceDate}}</span></div>\n  <!--<div class="chart-wrapper">-->\n  <!--TODO Fix api with subclassing-->\n  <!--<ngx-chart [data]="data" (price)="updatePrice($event)" (date)="updateDate($event)"></ngx-chart>-->\n  <chartjs [data]="data" (price)="updatePrice($event)" (date)="updateDate($event)"\n           [style.height]="calculateChartHeight"></chartjs>\n  <!--</div>-->\n</ion-content>\n'/*ion-inline-end:"/Users/elvis/coding/crypto/src/pages/coin-details/coin-details.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__services_api_service__["a" /* ApiService */]])
    ], CoinDetailsPage);
    return CoinDetailsPage;
}());

//# sourceMappingURL=coin-details.js.map

/***/ }),

/***/ 251:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return currencies; });
var currencies = [
    {
        name: 'Bitcoin',
        code: 'BTC',
        symbol: 'B'
    },
    {
        name: 'Euro',
        code: 'EUR',
        symbol: '€'
    },
    {
        name: 'US Dollar',
        code: 'USD',
        symbol: '$'
    },
    {
        name: 'Japanese yen',
        code: 'JPY',
        symbol: '¥'
    },
    {
        name: 'British Pound',
        code: 'GBP',
        symbol: '$'
    },
    {
        name: 'Australian Dollar',
        code: 'AUD',
        symbol: 'A$'
    },
    {
        name: 'Canadian Dollar',
        code: 'CAD',
        symbol: 'C$'
    },
    {
        name: 'Swiss Franc',
        code: 'CHF',
        symbol: 'Fr'
    },
    {
        name: 'Chinese Yuan Renminbi',
        code: 'CNY',
        symbol: '元'
    },
    {
        name: 'Swedish Krona',
        code: 'SEK',
        symbol: 'kr'
    },
    {
        name: 'New Zealand Dollar',
        code: 'NZD',
        symbol: 'NZ$'
    },
    {
        name: 'Mexican Peso',
        code: 'MXN',
        symbol: '$'
    },
    {
        name: 'Singapore Dollar',
        code: 'SGD',
        symbol: 'S$'
    },
    {
        name: 'Hong Kong Dollar',
        code: 'HKD',
        symbol: 'HK$'
    },
    {
        name: 'Norwegian Krone',
        code: 'NOK',
        symbol: 'kr'
    },
    {
        name: 'South Korean Won',
        code: 'KRW',
        symbol: '₩'
    },
    {
        name: 'Turkish Lira',
        code: 'TRY',
        symbol: '₺'
    },
    {
        name: 'Russian Ruble',
        code: 'RUB',
        symbol: '₽'
    },
    {
        name: 'Indian Rupee',
        code: 'INR',
        symbol: '₹'
    },
    {
        name: 'Brazilian Real',
        code: 'BRL',
        symbol: 'R$'
    },
    {
        name: 'South African Rand',
        code: 'ZAR',
        symbol: 'R'
    },
];
//# sourceMappingURL=currencies.js.map

/***/ }),

/***/ 372:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComponentsModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__custom_chart_custom_chart__ = __webpack_require__(566);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__swimlane_ngx_charts__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__swimlane_ngx_charts___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__swimlane_ngx_charts__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__custom_chart_tooltip_area_custom_chart_tooltip_area__ = __webpack_require__(801);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__custom_chart_circle_series_custom_chart_circle_series__ = __webpack_require__(802);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__custom_chart_line_series_custom_chart_line_series__ = __webpack_require__(803);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__custom_chart_line_custom_chart_line__ = __webpack_require__(804);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__chartjs_chartjs__ = __webpack_require__(805);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ngx_chart_ngx_chart__ = __webpack_require__(853);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_ionic_angular__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};










var ComponentsModule = (function () {
    function ComponentsModule() {
    }
    ComponentsModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_1__custom_chart_custom_chart__["a" /* CustomChartComponent */],
                __WEBPACK_IMPORTED_MODULE_3__custom_chart_tooltip_area_custom_chart_tooltip_area__["a" /* CustomChartTooltipAreaComponent */],
                __WEBPACK_IMPORTED_MODULE_4__custom_chart_circle_series_custom_chart_circle_series__["a" /* CustomChartCircleSeriesComponent */],
                __WEBPACK_IMPORTED_MODULE_5__custom_chart_line_series_custom_chart_line_series__["a" /* CustomChartLineSeriesComponent */],
                __WEBPACK_IMPORTED_MODULE_6__custom_chart_line_custom_chart_line__["a" /* CustomChartLineComponent */],
                __WEBPACK_IMPORTED_MODULE_7__chartjs_chartjs__["a" /* ChartjsComponent */],
                __WEBPACK_IMPORTED_MODULE_8__ngx_chart_ngx_chart__["a" /* NgxChartComponent */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_9_ionic_angular__["e" /* IonicModule */],
                __WEBPACK_IMPORTED_MODULE_2__swimlane_ngx_charts__["NgxChartsModule"],
            ],
            exports: [
                __WEBPACK_IMPORTED_MODULE_1__custom_chart_custom_chart__["a" /* CustomChartComponent */],
                __WEBPACK_IMPORTED_MODULE_3__custom_chart_tooltip_area_custom_chart_tooltip_area__["a" /* CustomChartTooltipAreaComponent */],
                __WEBPACK_IMPORTED_MODULE_4__custom_chart_circle_series_custom_chart_circle_series__["a" /* CustomChartCircleSeriesComponent */],
                __WEBPACK_IMPORTED_MODULE_5__custom_chart_line_series_custom_chart_line_series__["a" /* CustomChartLineSeriesComponent */],
                __WEBPACK_IMPORTED_MODULE_6__custom_chart_line_custom_chart_line__["a" /* CustomChartLineComponent */],
                __WEBPACK_IMPORTED_MODULE_7__chartjs_chartjs__["a" /* ChartjsComponent */],
                __WEBPACK_IMPORTED_MODULE_8__ngx_chart_ngx_chart__["a" /* NgxChartComponent */]
            ]
        })
    ], ComponentsModule);
    return ComponentsModule;
}());

//# sourceMappingURL=components.module.js.map

/***/ }),

/***/ 439:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CoinListPageModule", function() { return CoinListPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__coin_list__ = __webpack_require__(163);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pipes_pipes_module__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__coin_list_wallet__ = __webpack_require__(455);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ionic_image_loader__ = __webpack_require__(168);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ng_socket_io__ = __webpack_require__(440);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ng_socket_io___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_ng_socket_io__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var config = { url: 'wss://streamer.cryptocompare.com' };
var CoinListPageModule = (function () {
    function CoinListPageModule() {
    }
    CoinListPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__coin_list__["a" /* CoinListPage */],
                __WEBPACK_IMPORTED_MODULE_4__coin_list_wallet__["a" /* CoinListWalletPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_6_ng_socket_io__["SocketIoModule"].forRoot(config),
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__coin_list__["a" /* CoinListPage */]),
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_4__coin_list_wallet__["a" /* CoinListWalletPage */]),
                __WEBPACK_IMPORTED_MODULE_5_ionic_image_loader__["a" /* IonicImageLoader */],
                __WEBPACK_IMPORTED_MODULE_3__pipes_pipes_module__["a" /* PipesModule */]
            ],
        })
    ], CoinListPageModule);
    return CoinListPageModule;
}());

//# sourceMappingURL=coin-list.module.js.map

/***/ }),

/***/ 455:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CoinListWalletPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__coin_list__ = __webpack_require__(163);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_api_service__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_websocket_service__ = __webpack_require__(164);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var CoinListWalletPage = (function (_super) {
    __extends(CoinListWalletPage, _super);
    function CoinListWalletPage(navCtrl, navParams, storage, websocketService, apiService, toastCtrl, alertCtrl) {
        var _this = _super.call(this, navCtrl, navParams, storage, websocketService, apiService) || this;
        _this.navCtrl = navCtrl;
        _this.navParams = navParams;
        _this.storage = storage;
        _this.websocketService = websocketService;
        _this.apiService = apiService;
        _this.toastCtrl = toastCtrl;
        _this.alertCtrl = alertCtrl;
        _this.wallets = [];
        _this.search = true;
        _this.currentWalletIndex = navParams.data.walletIndex;
        _this.apiService.coinList.subscribe(function (coinList) {
            var filteredList = _this.filterCoinList(coinList);
            _this.sortList(_this.sorter);
            _this.coins = filteredList;
        });
        return _this;
    }
    CoinListWalletPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.storage.get('wallets').then(function (data) {
            if (data && data.length > 0) {
                _this.wallets = data;
                _this.storage.get('coin-list').then(function (list) {
                    if (!list) {
                        _this.apiService.getCoinList();
                    }
                    else {
                        var filteredList = _this.filterCoinList(list);
                        _this.coins = filteredList;
                    }
                });
            }
        });
    };
    CoinListWalletPage.prototype.filterCoinList = function (coinList) {
        var _this = this;
        if (this.wallets[this.currentWalletIndex].coins.length > 0) {
            return coinList.filter(function (coin) {
                return !_this.wallets[_this.currentWalletIndex].coins.some(function (item) { return item.coin.name === coin.name; });
            });
        }
        return coinList;
    };
    CoinListWalletPage.prototype.selectedCoin = function (coin) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'How many coins do you have?',
            inputs: [
                {
                    name: 'amount',
                    placeholder: 'amount',
                    type: 'number',
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function (data) {
                    }
                },
                {
                    text: 'Save',
                    handler: function (data) {
                        var value = data.amount.trim().replace(',', '.');
                        if (value) {
                            var walletCoin = {
                                coin: coin,
                                amount: parseFloat(value),
                            };
                            if (_this.wallets.length > 0) {
                                _this.wallets[_this.currentWalletIndex].coins.push(walletCoin);
                                _this.storage.set('wallets', _this.wallets).then(function () { return _this.navCtrl.pop(); });
                            }
                        }
                        else {
                            _this.openToast('Name cannot be empty');
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    CoinListWalletPage.prototype.openToast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            position: 'bottom',
            duration: 3000
        });
        toast.present();
    };
    CoinListWalletPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-coin-list-wallet',template:/*ion-inline-start:"/Users/elvis/coding/crypto/src/pages/coin-list/coin-list.html"*/'<ion-header no-border>\n  <ion-navbar>\n    <ion-title>\n      <ng-container *ngIf="!search; else wallet">\n        Cryptic\n      </ng-container>\n      <ng-template #wallet>\n        Choose your coin\n      </ng-template>\n    </ion-title>\n  </ion-navbar>\n  <ion-toolbar>\n    <ion-segment [(ngModel)]="listView" (ionChange)="listChanged($event)">\n      <ion-segment-button class="button-skewed" value="favorites" [ngClass]="{\'active\': listView === \'favorites\'}">\n        Favorites\n      </ion-segment-button>\n      <ion-segment-button class="button-skewed--inverse" value="coins" [ngClass]="{\'active\': listView === \'coins\'}">\n        All coins\n      </ion-segment-button>\n    </ion-segment>\n  </ion-toolbar>\n  <ion-toolbar class="sort-custom">\n    <ion-grid>\n      <ion-row>\n        <ion-col>\n        </ion-col>\n        <ion-col>\n          <ion-select\n            [style.visibility]="listHasCoins()"\n            [(ngModel)]="sorter"\n            [interface]="\'action-sheet\'"\n            (ionChange)="sorterChanged($event)">\n            <ion-option #item *ngFor="let sorter of sorters" [value]="sorter.value">{{sorter.name}}</ion-option>\n          </ion-select>\n        </ion-col>\n      </ion-row>\n    </ion-grid>\n\n  </ion-toolbar>\n</ion-header>\n\n<ion-content>\n  <ion-spinner class="big-loader" name="crescent" *ngIf="isCoinsView() && isLoading"></ion-spinner>\n  <ion-refresher *ngIf="isCoinsView()" (ionRefresh)="doRefresh($event)">\n    <ion-refresher-content pullingText="Pull to refresh"\n                           refreshingSpinner="crescent"\n                           refreshingText="Refreshing..."></ion-refresher-content>\n  </ion-refresher>\n  <ion-searchbar [(ngModel)]="searchTerm" *ngIf="isCoinsView()"\n                 (ionInput)="filterCoinsOnSearch($event)"></ion-searchbar>\n  <ion-list [virtualScroll]="list" [approxItemHeight]="\'70px\'"\n            [approxItemWidth]="\'100%\'" [virtualTrackBy]="trackByCoin" no-lines>\n    <ion-item-sliding #slidingItem *virtualItem="let coin">\n      <button ion-item #item (click)="selectedCoin(coin)" [ngClass]="{\'favorite\': coin.favorite}" detail-none>\n        <ion-avatar class="logo" item-start>\n          <img-loader [src]="coin.imageUrl" useImg></img-loader>\n        </ion-avatar>\n        <ion-label>\n          {{coin.name}}\n        </ion-label>\n        <span item-right class="price">\n          <span>{{coin.currency.symbol}} {{coin.price| numberFormatter: \'price\'}}</span>\n        </span>\n        <div class="change-icon" item-end>\n          <svg\n            viewBox="0 0 13 11"\n            class="delta"\n            [ngClass]="{\'negative\' : detectChange(coin.change)}"\n            version="1.1" xmlns="http://www.w3.org/2000/svg"\n          >\n            <title>Triangle</title>\n            <defs></defs>\n            <g id="Coin-row" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"\n               transform="translate(-344.000000, -41.000000)">\n              <polygon id="Triangle" stroke="#4EB92E" stroke-width="2" points="350.5 43 355 51 346 51"></polygon>\n            </g>\n          </svg>\n        </div>\n      </button>\n      <ion-item-options>\n        <button *ngIf="isCoinsView()" ion-button color="tertiary" (click)="addToFavorites(slidingItem, coin)">\n          Favorite\n        </button>\n        <button *ngIf="!isCoinsView()" ion-button color="danger" (click)="removeFromFavorites(slidingItem, coin)">\n          Remove\n        </button>\n      </ion-item-options>\n    </ion-item-sliding>\n  </ion-list>\n\n\n  <div *ngIf="listIsEmpty" class="empty-list" text-center padding>\n    <img src="./assets/imgs/pin.svg" alt="pin">\n    <button ion-button full color="tertiary" (click)="goToAllCoins()">Select your coins</button>\n  </div>\n</ion-content>\n'/*ion-inline-end:"/Users/elvis/coding/crypto/src/pages/coin-list/coin-list.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["h" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["i" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */],
            __WEBPACK_IMPORTED_MODULE_5__services_websocket_service__["a" /* WebsocketService */],
            __WEBPACK_IMPORTED_MODULE_3__services_api_service__["a" /* ApiService */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* AlertController */]])
    ], CoinListWalletPage);
    return CoinListWalletPage;
}(__WEBPACK_IMPORTED_MODULE_1__coin_list__["a" /* CoinListPage */]));

//# sourceMappingURL=coin-list-wallet.js.map

/***/ }),

/***/ 460:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingsPageModule", function() { return SettingsPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__settings__ = __webpack_require__(461);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var SettingsPageModule = (function () {
    function SettingsPageModule() {
    }
    SettingsPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__settings__["a" /* SettingsPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__settings__["a" /* SettingsPage */]),
            ],
        })
    ], SettingsPageModule);
    return SettingsPageModule;
}());

//# sourceMappingURL=settings.module.js.map

/***/ }),

/***/ 461:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SettingsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_api_service__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__classes_currencies__ = __webpack_require__(251);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var SettingsPage = (function () {
    function SettingsPage(navCtrl, navParams, apiService, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.apiService = apiService;
        this.storage = storage;
        this.currencies = __WEBPACK_IMPORTED_MODULE_4__classes_currencies__["a" /* currencies */];
        this.apiService.storedCurrency.subscribe(function (data) {
            if (data) {
                _this.currentCurrency = data.code;
            }
        });
    }
    SettingsPage.prototype.ionViewDidLoad = function () {
    };
    SettingsPage.prototype.currencyChanged = function (event) {
        var currency = this.currencies.find(function (item) {
            return item.code === event;
        });
        this.apiService.saveCurrency(currency);
    };
    SettingsPage.prototype.clearStorage = function () {
        this.storage.clear();
    };
    SettingsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-settings',template:/*ion-inline-start:"/Users/elvis/coding/crypto/src/pages/settings/settings.html"*/'<ion-header>\n\n  <ion-navbar>\n    <ion-title>Settings</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n  <ion-list>\n    <ion-list-header>\n      Preferences\n    </ion-list-header>\n    <ion-item>\n      <ion-label>Currency</ion-label>\n      <ion-select [(ngModel)]="currentCurrency" (ionChange)="currencyChanged($event)" [selectedText]="currentCurrency">\n        <ion-option #item *ngFor="let currency of currencies" [value]="currency.code">\n          {{currency.name}}\n        </ion-option>\n      </ion-select>\n    </ion-item>\n    <button ion-item [color]="\'danger\'" (click)="clearStorage()">\n      Clear storage\n    </button>\n    <ion-list-header>\n      Contact\n    </ion-list-header>\n    <button ion-item>\n      Sent me an email\n    </button>\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"/Users/elvis/coding/crypto/src/pages/settings/settings.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_3__services_api_service__["a" /* ApiService */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */]])
    ], SettingsPage);
    return SettingsPage;
}());

//# sourceMappingURL=settings.js.map

/***/ }),

/***/ 462:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TabsPageModule", function() { return TabsPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tabs__ = __webpack_require__(463);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var TabsPageModule = (function () {
    function TabsPageModule() {
    }
    TabsPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__tabs__["a" /* TabsPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__tabs__["a" /* TabsPage */]),
            ],
        })
    ], TabsPageModule);
    return TabsPageModule;
}());

//# sourceMappingURL=tabs.module.js.map

/***/ }),

/***/ 463:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__settings_settings__ = __webpack_require__(461);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__wallet_wallet__ = __webpack_require__(464);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__coin_list_coin_list__ = __webpack_require__(163);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var TabsPage = (function () {
    function TabsPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.tab1Root = __WEBPACK_IMPORTED_MODULE_4__coin_list_coin_list__["a" /* CoinListPage */];
        this.tab2Root = __WEBPACK_IMPORTED_MODULE_3__wallet_wallet__["a" /* WalletPage */];
        this.tab3Root = __WEBPACK_IMPORTED_MODULE_2__settings_settings__["a" /* SettingsPage */];
    }
    TabsPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad TabsPage');
    };
    TabsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-tabs',template:/*ion-inline-start:"/Users/elvis/coding/crypto/src/pages/tabs/tabs.html"*/'<ion-tabs>\n  <ion-tab [root]="tab1Root" tabIcon="fi-chart-fill"></ion-tab>\n  <ion-tab [root]="tab2Root" tabIcon="fi-money-fill"></ion-tab>\n  <ion-tab [root]="tab3Root" tabIcon="fi-interface-fill"></ion-tab>\n</ion-tabs>\n'/*ion-inline-end:"/Users/elvis/coding/crypto/src/pages/tabs/tabs.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */]])
    ], TabsPage);
    return TabsPage;
}());

//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 464:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WalletPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__coin_list_coin_list_wallet__ = __webpack_require__(455);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_storage__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__wallet_edit_wallet_edit__ = __webpack_require__(465);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_api_service__ = __webpack_require__(56);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var WalletPage = (function () {
    function WalletPage(navCtrl, navParams, alertCtrl, toastCtrl, apiService, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.apiService = apiService;
        this.storage = storage;
        this.wallets = [];
        this.walletButtonEnabled = false;
        this.buttonPressed = false;
        this.currentWalletName = '';
    }
    WalletPage.prototype.ionViewWillEnter = function () {
        this.getStoredWallets();
    };
    WalletPage.prototype.trackByCoin = function (index, item) {
        return index; // or item.id
    };
    WalletPage.prototype.currentTotal = function (wallet) {
        return !!wallet.total ? wallet.total : '0';
    };
    WalletPage.prototype.getStoredWallets = function () {
        var _this = this;
        this.storage.get('wallets').then(function (data) {
            if (data && data.length > 0) {
                _this.wallets = data;
                _this.calculateTotal();
                _this.currentWallet = _this.wallets[_this.slides.getActiveIndex()];
                _this.currentWalletName = _this.wallets[_this.slides.getActiveIndex()].name;
            }
            else {
                _this.walletButtonEnabled = true;
            }
        });
    };
    WalletPage.prototype.calculateTotal = function () {
        var _this = this;
        var total = 0;
        this.wallets.forEach(function (wallet) {
            wallet.coins.forEach(function (coin) {
                total += _this.getCoinPrice(coin);
                _this.currency = coin.coin.currency;
            });
            wallet.total = total;
            total = 0;
        });
    };
    WalletPage.prototype.buttonPress = function (event) {
        this.buttonPressed = true;
    };
    WalletPage.prototype.buttonRelease = function (event) {
        this.buttonPressed = false;
    };
    WalletPage.prototype.slideChanged = function (event) {
        if (event.realIndex || event.realIndex === 0) {
            this.currentWallet = this.wallets[event.realIndex];
            this.currentWalletName = this.wallets[event.realIndex].name;
        }
    };
    WalletPage.prototype.goToEditWallets = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__wallet_edit_wallet_edit__["a" /* WalletEditPage */]);
    };
    WalletPage.prototype.goToCoinList = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__coin_list_coin_list_wallet__["a" /* CoinListWalletPage */], { 'walletIndex': this.slides.getActiveIndex() });
    };
    WalletPage.prototype.getCoinPrice = function (amount) {
        return parseFloat(amount.amount) * amount.coin.price;
    };
    WalletPage.prototype.openToast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            position: 'bottom',
            duration: 3000
        });
        toast.present();
    };
    WalletPage.prototype.changeCoin = function (slider, index) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'New coin amount',
            inputs: [
                {
                    name: 'amount',
                    placeholder: 'amount',
                    type: 'number',
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function (data) {
                    }
                },
                {
                    text: 'Save',
                    handler: function (data) {
                        var value = data.amount.trim().replace(',', '.');
                        if (value) {
                            var walletIndex = _this.wallets.indexOf(_this.currentWallet);
                            _this.wallets[walletIndex].coins[index].amount = parseFloat(value);
                            _this.storage.set('wallets', _this.wallets);
                            _this.calculateTotal();
                            slider.close();
                        }
                        else {
                            _this.openToast('Name cannot be empty');
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    WalletPage.prototype.addNewWallet = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Wallet name',
            inputs: [
                {
                    name: 'name',
                    placeholder: 'Name',
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function (data) {
                    }
                },
                {
                    text: 'Save',
                    handler: function (data) {
                        if (data.name) {
                            if (!_this.checkIfExists(data)) {
                                var wallet = {
                                    name: data.name,
                                    coins: []
                                };
                                _this.wallets.push(wallet);
                                _this.storage.set('wallets', _this.wallets);
                            }
                            else {
                                _this.openToast('Name is already been used');
                            }
                        }
                        else {
                            _this.openToast('Name cannot be empty');
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    WalletPage.prototype.checkIfExists = function (data) {
        return !!this.wallets ? this.wallets.some(function (item) { return data.name.toLowerCase() === item.name.toLowerCase(); }) : false;
    };
    WalletPage.prototype.delete = function (item, index) {
        this.wallets[this.slides.getActiveIndex()].coins.splice(index, 1);
        this.storage.set('wallets', this.wallets);
        this.calculateTotal();
        item.close();
    };
    WalletPage.prototype.checkWallet = function () {
        return this.walletButtonEnabled && this.wallets.length === 0;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Slides */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Slides */])
    ], WalletPage.prototype, "slides", void 0);
    WalletPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-wallet',template:/*ion-inline-start:"/Users/elvis/coding/crypto/src/pages/wallet/wallet.html"*/'<ion-header no-border>\n  <ion-navbar>\n    <ion-title>Wallets</ion-title>\n    <ion-buttons end>\n      <button class="edit-list-button" ion-button color=\'tertiary\' (click)="goToEditWallets()">\n        <svg width="27px" height="27px" viewBox="0 0 43 43" version="1.1" xmlns="http://www.w3.org/2000/svg">\n          <title>signs</title>\n          <defs></defs>\n          <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n            <g id="signs" fill="#000000" fill-rule="nonzero">\n              <path\n                d="M5,17 C2.2429661,17 0,19.2429661 0,22 C0,24.7570339 2.2429661,27 5,27 C7.7570339,27 10,24.7570339 10,22 C10,19.2429661 7.7570339,17 5,17 Z M5,23.6101695 C4.11211864,23.6101695 3.38983051,22.8878814 3.38983051,22 C3.38983051,21.1121186 4.11211864,20.3898305 5,20.3898305 C5.88788136,20.3898305 6.61016949,21.1121186 6.61016949,22 C6.61016949,22.8878814 5.88788136,23.6101695 5,23.6101695 Z"\n                id="Shape"></path>\n              <path\n                d="M5,33 C2.2429661,33 0,35.2429661 0,38 C0,40.7570339 2.2429661,43 5,43 C7.7570339,43 10,40.7570339 10,38 C10,35.2429661 7.7570339,33 5,33 Z M5,39.6101695 C4.11211864,39.6101695 3.38983051,38.8878814 3.38983051,38 C3.38983051,37.1121186 4.11211864,36.3898305 5,36.3898305 C5.88788136,36.3898305 6.61016949,37.1121186 6.61016949,38 C6.61016949,38.8878814 5.88788136,39.6101695 5,39.6101695 Z"\n                id="Shape"></path>\n              <path\n                d="M5,0 C2.2429661,0 0,2.2429661 0,5 C0,7.7570339 2.2429661,10 5,10 C7.7570339,10 10,7.7570339 10,5 C10,2.2429661 7.7570339,0 5,0 Z M5,6.61016949 C4.11211864,6.61016949 3.38983051,5.88788136 3.38983051,5 C3.38983051,4.11211864 4.11211864,3.38983051 5,3.38983051 C5.88788136,3.38983051 6.61016949,4.11211864 6.61016949,5 C6.61016949,5.88788136 5.88788136,6.61016949 5,6.61016949 Z"\n                id="Shape"></path>\n              <polygon id="Rectangle-path" points="14 20 43 20 43 23 14 23"></polygon>\n              <polygon id="Rectangle-path" points="14 3 43 3 43 6 14 6"></polygon>\n              <polygon id="Rectangle-path" points="14 36 43 36 43 39 14 39"></polygon>\n            </g>\n          </g>\n        </svg>\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n  <ion-toolbar *ngIf="!checkWallet()" class="toolbar-header">\n    <ion-slides [pager]="true"\n                [paginationType]="\'bullets\'"\n                [centeredSlides]="false"\n                [zoom]="false"\n                (ionSlideDidChange)="slideChanged($event)">\n      <ion-slide class="align-top" *ngFor="let wallet of wallets">\n        <div class="wallet-price" text-center>\n          <div class="price">\n            <div class="currency">\n              <span class="currency__symbol">{{currency?.symbol}}</span>\n              <span class="currency__number">{{currentTotal(wallet) | numberFormatter: \'price\'}}</span>\n            </div>\n          </div>\n        </div>\n      </ion-slide>\n    </ion-slides>\n  </ion-toolbar>\n  <ion-toolbar *ngIf="!checkWallet()" class="toolbar-header">\n    <ion-grid class="grid-skewed" [ngClass]="{\'active\': buttonPressed}">\n      <ion-row>\n        <ion-col col-6 class="grid-skewed_first">\n          <ion-label>\n            {{currentWalletName}}\n          </ion-label>\n        </ion-col>\n        <ion-col col-6 class="grid-skewed_last" (touchstart)="buttonPress($event)" (touchend)="buttonRelease($event)"\n                 (click)="goToCoinList()">\n          <button *ngIf="wallets.length > 0" ion-button full>\n            Add coin\n          </button>\n        </ion-col>\n      </ion-row>\n    </ion-grid>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content *ngIf="!checkWallet()">\n  <ng-container *ngIf="wallets.length > 0;else loader">\n    <ion-list *ngIf="currentWallet?.coins?.length > 0;else noCoins">\n      <ion-item-sliding #item *ngFor="let amount of currentWallet.coins;trackBy: trackByCoin;let index = index;">\n        <ion-item detail-none>\n          <ion-avatar class="logo" item-start>\n            <img-loader [src]="amount.coin.imageUrl" useImg></img-loader>\n          </ion-avatar>\n          <ion-label>\n            {{amount.amount}}\n            <small>{{amount.coin.code}}</small>\n          </ion-label>\n          <span item-right class="price">\n          <span>{{amount.coin.currency.symbol}} {{getCoinPrice(amount) | numberFormatter: \'price\'}}</span>\n        </span>\n        </ion-item>\n        <ion-item-options>\n          <button ion-button color="tertiary" class="button-edit" (click)="changeCoin(item, index)">\n            edit\n          </button>\n          <button ion-button color="danger" (click)="delete(item, index)">\n            remove\n          </button>\n        </ion-item-options>\n      </ion-item-sliding>\n    </ion-list>\n    <ng-template #noCoins>\n      <div text-center class="empty-coins"><span>No coins yet</span></div>\n    </ng-template>\n  </ng-container>\n  <ng-template #loader>\n    <!--spinner-->\n  </ng-template>\n</ion-content>\n\n<ion-content *ngIf="checkWallet()">\n  <div class="empty-list" text-center padding>\n    <img src="./assets/imgs/wallet.svg" alt="pin">\n    <button ion-button full color="tertiary" (click)="addNewWallet()">Add new wallet</button>\n  </div>\n</ion-content>\n\n'/*ion-inline-end:"/Users/elvis/coding/crypto/src/pages/wallet/wallet.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_5__services_api_service__["a" /* ApiService */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_storage__["b" /* Storage */]])
    ], WalletPage);
    return WalletPage;
}());

//# sourceMappingURL=wallet.js.map

/***/ }),

/***/ 465:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WalletEditPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(48);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var WalletEditPage = (function () {
    function WalletEditPage(navCtrl, navParams, toastCtrl, alertCtrl, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.alertCtrl = alertCtrl;
        this.storage = storage;
        this.wallets = [];
    }
    WalletEditPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.storage.get('wallets').then(function (data) {
            if (!!data) {
                _this.wallets = data;
            }
        });
    };
    WalletEditPage.prototype.reorder = function (event) {
        this.wallets = Object(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* reorderArray */])(this.wallets, event);
        this.storage.set('wallets', this.wallets);
    };
    WalletEditPage.prototype.delete = function (index) {
        this.wallets.splice(index, 1);
        this.storage.set('wallets', this.wallets);
        var walletPage = this.navCtrl.first().instance;
        walletPage.slides.slideTo(0);
        if (this.wallets.length === 0) {
            walletPage.wallets = [];
            walletPage.currentWallet = null;
        }
    };
    WalletEditPage.prototype.openToast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            position: 'bottom',
            duration: 3000
        });
        toast.present();
    };
    WalletEditPage.prototype.changeWallet = function (slider, index) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'New wallet name',
            inputs: [
                {
                    name: 'name',
                    placeholder: 'Name',
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function (data) {
                    }
                },
                {
                    text: 'Save',
                    handler: function (data) {
                        _this.checkConstraints(function (value) {
                            _this.wallets[index].name = value;
                            _this.storage.set('wallets', _this.wallets);
                        }, data, slider);
                    }
                }
            ]
        });
        alert.present();
    };
    WalletEditPage.prototype.addNewWallet = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Wallet name',
            inputs: [
                {
                    name: 'name',
                    placeholder: 'Name',
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function (data) {
                    }
                },
                {
                    text: 'Save',
                    handler: function (data) {
                        _this.checkConstraints(function (value) {
                            var wallet = {
                                name: value,
                                coins: []
                            };
                            _this.wallets.push(wallet);
                            _this.storage.set('wallets', _this.wallets);
                        }, data);
                    }
                }
            ]
        });
        alert.present();
    };
    WalletEditPage.prototype.checkConstraints = function (storeValue, data, slider) {
        var value = data.name.trim();
        if (value) {
            if (value.length <= 32) {
                if (!this.checkIfExists(value)) {
                    storeValue(value);
                }
                else {
                    this.openToast('Name is already used');
                }
                if (!!slider) {
                    slider.close();
                }
            }
            else {
                this.openToast('Name cannot be more then 32 characters');
            }
        }
        else {
            this.openToast('Name cannot be empty');
        }
    };
    WalletEditPage.prototype.checkIfExists = function (value) {
        return !!this.wallets ? this.wallets.some(function (item) { return value.toLowerCase() === item.name.toLowerCase(); }) : false;
    };
    WalletEditPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-wallet-edit',template:/*ion-inline-start:"/Users/elvis/coding/crypto/src/pages/wallet-edit/wallet-edit.html"*/'<ion-header no-border>\n  <ion-navbar>\n    <ion-title>Edit wallets</ion-title>\n    <ion-buttons end>\n      <button class="add-button" ion-button color=\'tertiary\' (click)="addNewWallet()">\n        <svg width="43px" height="43px" viewBox="0 0 43 43" version="1.1" xmlns="http://www.w3.org/2000/svg">\n          <title>plus</title>\n          <defs></defs>\n          <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n            <g id="plus" fill-rule="nonzero" stroke="#000000" stroke-width="3">\n              <polygon id="Shape"\n                       points="43 20.0824176 22.9175824 20.0824176 22.9175824 0 20.0824176 0 20.0824176 20.0824176 0 20.0824176 0 22.9175824 20.0824176 22.9175824 20.0824176 43 22.9175824 43 22.9175824 22.9175824 43 22.9175824"></polygon>\n            </g>\n          </g>\n        </svg>\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <ion-list reorder="true" (ionItemReorder)="reorder($event);">\n    <ion-item-sliding #item *ngFor="let wallet of wallets;let index = index">\n      <ion-item detail-none>\n        <h1><strong>{{ wallet.name }}</strong></h1>\n      </ion-item>\n      <ion-item-options>\n        <button ion-button color="tertiary" (click)="changeWallet(item, index)">\n          edit\n        </button>\n        <button ion-button color="danger" (click)="delete(index)">\n          remove\n        </button>\n      </ion-item-options>\n    </ion-item-sliding>\n  </ion-list>\n</ion-content>\n\n'/*ion-inline-end:"/Users/elvis/coding/crypto/src/pages/wallet-edit/wallet-edit.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */]])
    ], WalletEditPage);
    return WalletEditPage;
}());

//# sourceMappingURL=wallet-edit.js.map

/***/ }),

/***/ 466:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WalletEditPageModule", function() { return WalletEditPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__wallet_edit__ = __webpack_require__(465);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var WalletEditPageModule = (function () {
    function WalletEditPageModule() {
    }
    WalletEditPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__wallet_edit__["a" /* WalletEditPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__wallet_edit__["a" /* WalletEditPage */]),
            ],
        })
    ], WalletEditPageModule);
    return WalletEditPageModule;
}());

//# sourceMappingURL=wallet-edit.module.js.map

/***/ }),

/***/ 467:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WalletPageModule", function() { return WalletPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__wallet__ = __webpack_require__(464);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pipes_pipes_module__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_components_module__ = __webpack_require__(372);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ionic_image_loader__ = __webpack_require__(168);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






var WalletPageModule = (function () {
    function WalletPageModule() {
    }
    WalletPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__wallet__["a" /* WalletPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__wallet__["a" /* WalletPage */]),
                __WEBPACK_IMPORTED_MODULE_3__pipes_pipes_module__["a" /* PipesModule */],
                __WEBPACK_IMPORTED_MODULE_5_ionic_image_loader__["a" /* IonicImageLoader */],
                __WEBPACK_IMPORTED_MODULE_4__components_components_module__["a" /* ComponentsModule */],
            ],
        })
    ], WalletPageModule);
    return WalletPageModule;
}());

//# sourceMappingURL=wallet.module.js.map

/***/ }),

/***/ 510:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(511);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(530);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 530:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(507);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(508);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_component__ = __webpack_require__(905);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_api_service__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__angular_common_http__ = __webpack_require__(250);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_in_app_browser__ = __webpack_require__(906);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__angular_platform_browser_animations__ = __webpack_require__(907);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_tabs_tabs_module__ = __webpack_require__(462);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_coin_details_coin_details_module__ = __webpack_require__(248);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_coin_list_coin_list_module__ = __webpack_require__(439);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_settings_settings_module__ = __webpack_require__(460);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_wallet_wallet_module__ = __webpack_require__(467);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__ionic_storage__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_wallet_edit_wallet_edit_module__ = __webpack_require__(466);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__ionic_native_screen_orientation__ = __webpack_require__(509);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__ionic_native_native_page_transitions__ = __webpack_require__(909);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19_ionic_image_loader__ = __webpack_require__(168);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__services_websocket_service__ = __webpack_require__(164);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





















var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* CryptoMoon */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["BrowserModule"],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["e" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* CryptoMoon */], {
                    backButtonText: '',
                    swipeBackEnabled: false,
                }, {
                    links: [
                        { loadChildren: '../pages/coin-details/coin-details.module#CoinDetailsPageModule', name: 'CoinDetailsPage', segment: 'coin-details', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/coin-list/coin-list.module#CoinListPageModule', name: 'CoinListPage', segment: 'coin-list', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/settings/settings.module#SettingsPageModule', name: 'SettingsPage', segment: 'settings', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/tabs/tabs.module#TabsPageModule', name: 'TabsPage', segment: 'tabs', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/wallet-edit/wallet-edit.module#WalletEditPageModule', name: 'WalletEditPage', segment: 'wallet-edit', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/wallet/wallet.module#WalletPageModule', name: 'WalletPage', segment: 'wallet', priority: 'low', defaultHistory: [] }
                    ]
                }),
                __WEBPACK_IMPORTED_MODULE_15__ionic_storage__["a" /* IonicStorageModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_19_ionic_image_loader__["a" /* IonicImageLoader */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_9__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */],
                __WEBPACK_IMPORTED_MODULE_7__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_10__pages_tabs_tabs_module__["TabsPageModule"],
                __WEBPACK_IMPORTED_MODULE_12__pages_coin_list_coin_list_module__["CoinListPageModule"],
                __WEBPACK_IMPORTED_MODULE_11__pages_coin_details_coin_details_module__["CoinDetailsPageModule"],
                __WEBPACK_IMPORTED_MODULE_14__pages_wallet_wallet_module__["WalletPageModule"],
                __WEBPACK_IMPORTED_MODULE_16__pages_wallet_edit_wallet_edit_module__["WalletEditPageModule"],
                __WEBPACK_IMPORTED_MODULE_13__pages_settings_settings_module__["SettingsPageModule"],
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* CryptoMoon */],
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["ErrorHandler"], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_6__services_api_service__["a" /* ApiService */],
                __WEBPACK_IMPORTED_MODULE_20__services_websocket_service__["a" /* WebsocketService */],
                __WEBPACK_IMPORTED_MODULE_8__ionic_native_in_app_browser__["a" /* InAppBrowser */],
                __WEBPACK_IMPORTED_MODULE_17__ionic_native_screen_orientation__["a" /* ScreenOrientation */],
                __WEBPACK_IMPORTED_MODULE_18__ionic_native_native_page_transitions__["a" /* NativePageTransitions */]
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 56:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ApiService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__(250);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_storage__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__classes_currencies__ = __webpack_require__(251);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_BehaviorSubject__ = __webpack_require__(563);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_BehaviorSubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_BehaviorSubject__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var COINAMOUNT = null;
var BATCHSIZE = 60;
var ApiService = (function () {
    function ApiService(http, storage) {
        var _this = this;
        this.http = http;
        this.storage = storage;
        this.coinList = new __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__["Subject"]();
        this.indexStart = 0;
        this.currencyList = {};
        this.pricePromises = [];
        this.isLoading = false;
        this.coinHistoryPriceList = new __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__["Subject"]();
        this.coinHistoryPriceListJS = new __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__["Subject"]();
        this.storedCurrency = new __WEBPACK_IMPORTED_MODULE_5_rxjs_BehaviorSubject__["BehaviorSubject"](__WEBPACK_IMPORTED_MODULE_4__classes_currencies__["a" /* currencies */].find(function (item) { return item.code === 'USD'; }));
        this.storage.get('currency').then(function (currency) {
            if (currency) {
                _this.storedCurrency.next(currency);
            }
        });
        this.storedCurrency.subscribe(function (item) {
            _this.currentCurrency = item;
        });
    }
    ApiService_1 = ApiService;
    // TODO Do something when the api is down
    ApiService.renderPriceHistory = function (historyData) {
        return historyData.map(function (minuteObject) {
            return {
                name: minuteObject.time,
                value: minuteObject.close
            };
        });
    };
    ApiService.renderPriceHistoryChartJSLabel = function (historyData) {
        return historyData.map(function (minuteObject) {
            return minuteObject.time;
        });
    };
    ApiService.renderPriceHistoryChartJSValue = function (historyData) {
        return historyData.map(function (minuteObject) {
            return minuteObject.close;
        });
    };
    ApiService.getCurrencieCodes = function () {
        return __WEBPACK_IMPORTED_MODULE_4__classes_currencies__["a" /* currencies */].map(function (item) { return item.code; }).join();
    };
    ApiService.prototype.saveCurrency = function (currency) {
        this.storage.set('currency', currency);
        this.storedCurrency.next(currency);
        this.getCoinList();
    };
    ApiService.prototype.callCoinList = function () {
        return this.http.get('https://min-api.cryptocompare.com/data/all/coinlist');
    };
    ApiService.prototype.callPriceList = function (coins) {
        return this.http.get("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + coins + "&tsyms=" + this.currentCurrency.code + "&e=CCCAGG"); // TODO: fix currency to dynamic
    };
    ApiService.prototype.getPriceHistoryHour = function (coin) {
        var code = coin.code;
        var url = this.http.get("https://min-api.cryptocompare.com/data/histominute?fsym=" + code + "&tsym=" + this.currentCurrency.code + "&limit=60&aggregate=1&e=CCCAGG");
        this.getPriceDataChartJS(url, coin);
    };
    ApiService.prototype.getPriceHistoryDay = function (coin) {
        var code = coin.code;
        var url = this.http.get("https://min-api.cryptocompare.com/data/histominute?fsym=" + code + "&tsym=" + this.currentCurrency.code + "&limit=1440&aggregate=30&e=CCCAGG");
        this.getPriceDataChartJS(url, coin);
    };
    ApiService.prototype.getPriceHistoryWeek = function (coin) {
        var code = coin.code;
        var url = this.http.get("https://min-api.cryptocompare.com/data/histohour?fsym=" + code + "&tsym=" + this.currentCurrency.code + "&limit=168&aggregate=1&e=CCCAGG");
        this.getPriceDataChartJS(url, coin);
    };
    ApiService.prototype.getPriceHistoryMonth = function (coin) {
        var code = coin.code;
        var url = this.http.get("https://min-api.cryptocompare.com/data/histoday?fsym=" + code + "&tsym=" + this.currentCurrency.code + "&limit=30&aggregate=1&e=CCCAGG");
        this.getPriceDataChartJS(url, coin);
    };
    ApiService.prototype.getPriceHistoryYear = function (coin) {
        var code = coin.code;
        var url = this.http.get("https://min-api.cryptocompare.com/data/histoday?fsym=" + code + "&tsym=" + this.currentCurrency.code + "&limit=365&aggregate=1&e=CCCAGG");
        this.getPriceDataChartJS(url, coin);
    };
    ApiService.prototype.getPriceHistoryAll = function (coin) {
        var code = coin.code;
        var url = this.http.get("https://min-api.cryptocompare.com/data/histoday?fsym=" + code + "&tsym=" + this.currentCurrency.code + "&aggregate=1&e=CCCAGG&allData=true");
        this.getPriceDataChartJS(url, coin);
    };
    ApiService.prototype.getCoinList = function () {
        var _this = this;
        if (!this.refresher) {
            this.isLoading = true;
        }
        this.callCoinList().subscribe(function (data) {
            var coinMarketCoinList = data;
            var baseImageUrl = coinMarketCoinList['BaseImageUrl'];
            var coinListJson = coinMarketCoinList['Data'];
            var listOfCoinProperties = Object.keys(coinListJson).filter(function (coin) { return !(coin.indexOf('*') > -1); });
            if (COINAMOUNT) {
                listOfCoinProperties.length = COINAMOUNT;
            }
            _this.getPricesPerBatchSize(listOfCoinProperties, BATCHSIZE);
            _this.prepareCoinList(listOfCoinProperties, coinListJson, baseImageUrl);
        }, function (err) { return console.error(err); }, function () { return console.log('done loading coins'); });
    };
    ApiService.prototype.prepareCoinList = function (listOfCoinProperties, coinListJson, baseImageUrl) {
        var _this = this;
        Promise.all(this.pricePromises).then(function () {
            var coinList = listOfCoinProperties.filter(function (coin) {
                return _this.checkForEmptyCoins(coinListJson, coin);
            }).map(function (coin) {
                return _this.mapToCoin(coinListJson, coin, baseImageUrl);
            }).filter(function (coin) {
                return !!coin.marketcap && !!coin.change;
            });
            _this.isLoading = false;
            _this.indexStart = 0;
            if (_this.refresher) {
                _this.refresher.complete();
                _this.refresher = null;
            }
            _this.coinList.next(coinList);
            _this.updateWallets(coinList);
        }, function (err) { return console.error(err); });
    };
    ApiService.prototype.updateWallets = function (coinList) {
        var _this = this;
        this.storage.get('wallets').then(function (wallets) {
            if (wallets && wallets.length > 0) {
                wallets.forEach(function (wallet) {
                    wallet.coins.forEach(function (walletItem) {
                        walletItem.coin = coinList.find(function (coin) {
                            return coin.name === walletItem.coin.name;
                        });
                    });
                });
                _this.storage.set('wallets', wallets);
            }
        });
    };
    ApiService.prototype.mapToCoin = function (coinListJson, coin, baseImageUrl) {
        var coinObject = coinListJson[coin];
        var currencies = this.mapCurrencies(coin);
        return Object.assign({
            name: coinObject['CoinName'],
            code: coinObject['Symbol'],
            imageUrl: baseImageUrl + coinObject['ImageUrl'],
            order: coinObject['SortOrder'],
        }, currencies[this.currentCurrency.code]);
    };
    ApiService.prototype.checkForEmptyCoins = function (coinListJson, coin) {
        var coinObject = coinListJson[coin];
        var hasName = coinObject.hasOwnProperty('CoinName') && !!coinObject['CoinName'];
        var hasUrl = coinObject.hasOwnProperty('Url') && !!coinObject['Url'];
        var hasImage = coinObject.hasOwnProperty('ImageUrl') && !!coinObject['ImageUrl'];
        var hasPrice = this.currencyList[coin] && !!this.currencyList[coin][this.currentCurrency.code];
        var notSponsored = coinObject.hasOwnProperty('Sponsored') && !coinObject['Sponsored'];
        return hasName && hasUrl && hasImage && hasPrice && notSponsored;
    };
    ApiService.prototype.getPricesPerBatchSize = function (listOfCoinProperties, batchSize) {
        var _this = this;
        var range = this.indexStart + batchSize;
        var shortCoinNames = listOfCoinProperties.slice(this.indexStart, range);
        var priceList = this.callPriceList(shortCoinNames.join()).toPromise();
        this.pricePromises.push(new Promise(function (resolve, reject) {
            priceList.then(function (data) {
                Object.assign(_this.currencyList, data['RAW']);
                resolve();
            });
        }));
        this.indexStart += batchSize + 1;
        if (range < listOfCoinProperties.length) {
            this.getPricesPerBatchSize(listOfCoinProperties, batchSize);
        }
    };
    ApiService.prototype.mapCurrencies = function (coin) {
        if (this.currencyList[coin]) {
            var currencies_1 = this.currencyList[coin];
            for (var currency in currencies_1) {
                if (currencies_1.hasOwnProperty(currency)) {
                    currencies_1[currency] = {
                        currency: this.currentCurrency,
                        price: currencies_1[currency]['PRICE'],
                        priceLastUpdated: currencies_1[currency]['LASTUPDATE'],
                        change: currencies_1[currency]['CHANGEPCT24HOUR'],
                        marketcap: currencies_1[currency]['MKTCAP'],
                    };
                }
            }
            return currencies_1;
        }
    };
    ApiService.prototype.refreshCoinList = function (refresher) {
        var _this = this;
        this.refresher = refresher;
        setTimeout(function () { return _this.getCoinList(); }, 500);
    };
    ApiService.prototype.getPriceData = function (url, coin) {
        var _this = this;
        url.subscribe(function (data) {
            var historyData = data['Data'];
            _this.coinHistoryPriceList.next([
                {
                    "name": coin.name,
                    "series": ApiService_1.renderPriceHistory(historyData)
                },
            ]);
        }, function (err) { return console.error(err); }, function () { return console.log('done loading chart'); });
    };
    ApiService.prototype.getPriceDataChartJS = function (url, coin) {
        var _this = this;
        setTimeout(function () {
            url.subscribe(function (data) {
                var historyData = data['Data'];
                _this.coinHistoryPriceListJS.next({
                    labels: ApiService_1.renderPriceHistoryChartJSLabel(historyData),
                    data: ApiService_1.renderPriceHistoryChartJSValue(historyData)
                });
            }, function (err) { return console.error(err); }, function () { return console.log('done loading chart'); });
        }, 500);
    };
    ApiService = ApiService_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_3__ionic_storage__["b" /* Storage */]])
    ], ApiService);
    return ApiService;
    var ApiService_1;
}());

//# sourceMappingURL=api.service.js.map

/***/ }),

/***/ 564:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 253,
	"./af.js": 253,
	"./ar": 254,
	"./ar-dz": 255,
	"./ar-dz.js": 255,
	"./ar-kw": 256,
	"./ar-kw.js": 256,
	"./ar-ly": 257,
	"./ar-ly.js": 257,
	"./ar-ma": 258,
	"./ar-ma.js": 258,
	"./ar-sa": 259,
	"./ar-sa.js": 259,
	"./ar-tn": 260,
	"./ar-tn.js": 260,
	"./ar.js": 254,
	"./az": 261,
	"./az.js": 261,
	"./be": 262,
	"./be.js": 262,
	"./bg": 263,
	"./bg.js": 263,
	"./bm": 264,
	"./bm.js": 264,
	"./bn": 265,
	"./bn.js": 265,
	"./bo": 266,
	"./bo.js": 266,
	"./br": 267,
	"./br.js": 267,
	"./bs": 268,
	"./bs.js": 268,
	"./ca": 269,
	"./ca.js": 269,
	"./cs": 270,
	"./cs.js": 270,
	"./cv": 271,
	"./cv.js": 271,
	"./cy": 272,
	"./cy.js": 272,
	"./da": 273,
	"./da.js": 273,
	"./de": 274,
	"./de-at": 275,
	"./de-at.js": 275,
	"./de-ch": 276,
	"./de-ch.js": 276,
	"./de.js": 274,
	"./dv": 277,
	"./dv.js": 277,
	"./el": 278,
	"./el.js": 278,
	"./en-au": 279,
	"./en-au.js": 279,
	"./en-ca": 280,
	"./en-ca.js": 280,
	"./en-gb": 281,
	"./en-gb.js": 281,
	"./en-ie": 282,
	"./en-ie.js": 282,
	"./en-nz": 283,
	"./en-nz.js": 283,
	"./eo": 284,
	"./eo.js": 284,
	"./es": 285,
	"./es-do": 286,
	"./es-do.js": 286,
	"./es-us": 287,
	"./es-us.js": 287,
	"./es.js": 285,
	"./et": 288,
	"./et.js": 288,
	"./eu": 289,
	"./eu.js": 289,
	"./fa": 290,
	"./fa.js": 290,
	"./fi": 291,
	"./fi.js": 291,
	"./fo": 292,
	"./fo.js": 292,
	"./fr": 293,
	"./fr-ca": 294,
	"./fr-ca.js": 294,
	"./fr-ch": 295,
	"./fr-ch.js": 295,
	"./fr.js": 293,
	"./fy": 296,
	"./fy.js": 296,
	"./gd": 297,
	"./gd.js": 297,
	"./gl": 298,
	"./gl.js": 298,
	"./gom-latn": 299,
	"./gom-latn.js": 299,
	"./gu": 300,
	"./gu.js": 300,
	"./he": 301,
	"./he.js": 301,
	"./hi": 302,
	"./hi.js": 302,
	"./hr": 303,
	"./hr.js": 303,
	"./hu": 304,
	"./hu.js": 304,
	"./hy-am": 305,
	"./hy-am.js": 305,
	"./id": 306,
	"./id.js": 306,
	"./is": 307,
	"./is.js": 307,
	"./it": 308,
	"./it.js": 308,
	"./ja": 309,
	"./ja.js": 309,
	"./jv": 310,
	"./jv.js": 310,
	"./ka": 311,
	"./ka.js": 311,
	"./kk": 312,
	"./kk.js": 312,
	"./km": 313,
	"./km.js": 313,
	"./kn": 314,
	"./kn.js": 314,
	"./ko": 315,
	"./ko.js": 315,
	"./ky": 316,
	"./ky.js": 316,
	"./lb": 317,
	"./lb.js": 317,
	"./lo": 318,
	"./lo.js": 318,
	"./lt": 319,
	"./lt.js": 319,
	"./lv": 320,
	"./lv.js": 320,
	"./me": 321,
	"./me.js": 321,
	"./mi": 322,
	"./mi.js": 322,
	"./mk": 323,
	"./mk.js": 323,
	"./ml": 324,
	"./ml.js": 324,
	"./mr": 325,
	"./mr.js": 325,
	"./ms": 326,
	"./ms-my": 327,
	"./ms-my.js": 327,
	"./ms.js": 326,
	"./mt": 328,
	"./mt.js": 328,
	"./my": 329,
	"./my.js": 329,
	"./nb": 330,
	"./nb.js": 330,
	"./ne": 331,
	"./ne.js": 331,
	"./nl": 332,
	"./nl-be": 333,
	"./nl-be.js": 333,
	"./nl.js": 332,
	"./nn": 334,
	"./nn.js": 334,
	"./pa-in": 335,
	"./pa-in.js": 335,
	"./pl": 336,
	"./pl.js": 336,
	"./pt": 337,
	"./pt-br": 338,
	"./pt-br.js": 338,
	"./pt.js": 337,
	"./ro": 339,
	"./ro.js": 339,
	"./ru": 340,
	"./ru.js": 340,
	"./sd": 341,
	"./sd.js": 341,
	"./se": 342,
	"./se.js": 342,
	"./si": 343,
	"./si.js": 343,
	"./sk": 344,
	"./sk.js": 344,
	"./sl": 345,
	"./sl.js": 345,
	"./sq": 346,
	"./sq.js": 346,
	"./sr": 347,
	"./sr-cyrl": 348,
	"./sr-cyrl.js": 348,
	"./sr.js": 347,
	"./ss": 349,
	"./ss.js": 349,
	"./sv": 350,
	"./sv.js": 350,
	"./sw": 351,
	"./sw.js": 351,
	"./ta": 352,
	"./ta.js": 352,
	"./te": 353,
	"./te.js": 353,
	"./tet": 354,
	"./tet.js": 354,
	"./th": 355,
	"./th.js": 355,
	"./tl-ph": 356,
	"./tl-ph.js": 356,
	"./tlh": 357,
	"./tlh.js": 357,
	"./tr": 358,
	"./tr.js": 358,
	"./tzl": 359,
	"./tzl.js": 359,
	"./tzm": 360,
	"./tzm-latn": 361,
	"./tzm-latn.js": 361,
	"./tzm.js": 360,
	"./uk": 362,
	"./uk.js": 362,
	"./ur": 363,
	"./ur.js": 363,
	"./uz": 364,
	"./uz-latn": 365,
	"./uz-latn.js": 365,
	"./uz.js": 364,
	"./vi": 366,
	"./vi.js": 366,
	"./x-pseudo": 367,
	"./x-pseudo.js": 367,
	"./yo": 368,
	"./yo.js": 368,
	"./zh-cn": 369,
	"./zh-cn.js": 369,
	"./zh-hk": 370,
	"./zh-hk.js": 370,
	"./zh-tw": 371,
	"./zh-tw.js": 371
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 564;

/***/ }),

/***/ 565:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NumberFormatterPipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var NumberFormatterPipe = (function () {
    function NumberFormatterPipe() {
    }
    NumberFormatterPipe.prototype.transform = function (value) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (value) {
            var options_1 = {};
            if (args.length > 0) {
                args.forEach(function (arg) {
                    if (arg === 'price') {
                        if (parseFloat(value.toString(10)) >= 100) {
                            options_1['minimumFractionDigits'] = 0;
                            options_1['maximumFractionDigits'] = 0;
                        }
                        if (parseFloat(value.toString(10)) < 100) {
                            options_1['minimumFractionDigits'] = 2;
                            options_1['maximumFractionDigits'] = 2;
                        }
                        if (parseFloat(value.toString(10)) < 0.01) {
                            options_1['minimumFractionDigits'] = 3;
                            options_1['maximumFractionDigits'] = 3;
                        }
                        if (parseFloat(value.toString(10)) < 0.001) {
                            options_1['minimumFractionDigits'] = 4;
                            options_1['maximumFractionDigits'] = 4;
                        }
                        if (parseFloat(value.toString(10)) < 0.0001) {
                            options_1['minimumFractionDigits'] = 5;
                            options_1['maximumFractionDigits'] = 5;
                        }
                        if (parseFloat(value.toString(10)) < 0.00001) {
                            options_1['minimumFractionDigits'] = 6;
                            options_1['maximumFractionDigits'] = 6;
                        }
                        if (parseFloat(value.toString(10)) <= 0) {
                            options_1['minimumFractionDigits'] = 0;
                            options_1['maximumFractionDigits'] = 0;
                        }
                    }
                    if (arg === 'perc') {
                        options_1['maximumFractionDigits'] = 2;
                    }
                });
            }
            else {
                options_1['minimumFractionDigits'] = 0;
                options_1['maximumFractionDigits'] = 0;
            }
            return new Intl.NumberFormat('de-DE', options_1).format(value);
        }
        return null;
    };
    NumberFormatterPipe = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Pipe"])({
            name: 'numberFormatter',
        })
    ], NumberFormatterPipe);
    return NumberFormatterPipe;
}());

//# sourceMappingURL=number-formatter.js.map

/***/ }),

/***/ 566:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustomChartComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_animations__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__swimlane_ngx_charts__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__swimlane_ngx_charts___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__swimlane_ngx_charts__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_d3_shape__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__swimlane_ngx_charts_release_utils__ = __webpack_require__(162);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_d3_scale__ = __webpack_require__(413);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var CustomChartComponent = (function (_super) {
    __extends(CustomChartComponent, _super);
    function CustomChartComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.legendTitle = 'Legend';
        _this.showGridLines = true;
        _this.curve = __WEBPACK_IMPORTED_MODULE_3_d3_shape__["curveLinear"];
        _this.activeEntries = [];
        _this.roundDomains = false;
        _this.tooltipDisabled = false;
        _this.showRefLines = false;
        _this.showRefLabels = true;
        _this.activate = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        _this.deactivate = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        _this.touchEnd = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        _this.margin = [10, 20, 10, 20];
        _this.xAxisHeight = 0;
        _this.yAxisWidth = 0;
        _this.timelineHeight = 50;
        _this.timelinePadding = 10;
        return _this;
    }
    CustomChartComponent.prototype.update = function () {
        _super.prototype.update.call(this);
        this.dims = Object(__WEBPACK_IMPORTED_MODULE_2__swimlane_ngx_charts__["calculateViewDimensions"])({
            width: this.width,
            height: this.height,
            margins: this.margin,
            showXAxis: this.xAxis,
            showYAxis: this.yAxis,
            xAxisHeight: this.xAxisHeight,
            yAxisWidth: this.yAxisWidth,
            showXLabel: this.showXAxisLabel,
            showYLabel: this.showYAxisLabel,
            showLegend: this.legend,
            legendType: this.schemeType,
        });
        if (this.timeline) {
            this.dims.height -= (this.timelineHeight + this.margin[2] + this.timelinePadding);
        }
        this.xDomain = this.getXDomain();
        if (this.filteredDomain) {
            this.xDomain = this.filteredDomain;
        }
        this.yDomain = this.getYDomain();
        this.seriesDomain = this.getSeriesDomain();
        this.xScale = this.getXScale(this.xDomain, this.dims.width);
        this.yScale = this.getYScale(this.yDomain, this.dims.height);
        this.updateTimeline();
        this.setColors();
        this.legendOptions = this.getLegendOptions();
        this.transform = "translate(" + this.dims.xOffset + " , " + this.margin[0] + ")";
        this.clipPathId = 'clip' + Object(__WEBPACK_IMPORTED_MODULE_4__swimlane_ngx_charts_release_utils__["a" /* id */])().toString();
        this.clipPath = "url(#" + this.clipPathId + ")";
    };
    CustomChartComponent.prototype.updateTimeline = function () {
        if (this.timeline) {
            this.timelineWidth = this.dims.width;
            this.timelineXDomain = this.getXDomain();
            this.timelineXScale = this.getXScale(this.timelineXDomain, this.timelineWidth);
            this.timelineYScale = this.getYScale(this.yDomain, this.timelineHeight);
            this.timelineTransform = "translate(" + this.dims.xOffset + ", " + -this.margin[2] + ")";
        }
    };
    CustomChartComponent.prototype.getXDomain = function () {
        var values = [];
        for (var _i = 0, _a = this.results; _i < _a.length; _i++) {
            var results = _a[_i];
            for (var _b = 0, _c = results.series; _b < _c.length; _b++) {
                var d = _c[_b];
                if (!values.includes(d.name)) {
                    values.push(d.name);
                }
            }
        }
        this.scaleType = this.getScaleType(values);
        var domain = [];
        if (this.scaleType === 'linear') {
            values = values.map(function (v) { return Number(v); });
        }
        var min;
        var max;
        if (this.scaleType === 'time' || this.scaleType === 'linear') {
            min = this.xScaleMin
                ? this.xScaleMin
                : Math.min.apply(Math, values);
            max = this.xScaleMax
                ? this.xScaleMax
                : Math.max.apply(Math, values);
        }
        if (this.scaleType === 'time') {
            domain = [new Date(min), new Date(max)];
            this.xSet = values.slice().sort(function (a, b) {
                var aDate = a.getTime();
                var bDate = b.getTime();
                if (aDate > bDate)
                    return 1;
                if (bDate > aDate)
                    return -1;
                return 0;
            });
        }
        else if (this.scaleType === 'linear') {
            domain = [min, max];
            // Use compare function to sort numbers numerically
            this.xSet = values.slice().sort(function (a, b) { return (a - b); });
        }
        else {
            domain = values;
            this.xSet = values;
        }
        return domain;
    };
    CustomChartComponent.prototype.getYDomain = function () {
        var domain = [];
        for (var _i = 0, _a = this.results; _i < _a.length; _i++) {
            var results = _a[_i];
            for (var _b = 0, _c = results.series; _b < _c.length; _b++) {
                var d = _c[_b];
                if (domain.indexOf(d.value) < 0) {
                    domain.push(d.value);
                }
                if (d.min !== undefined) {
                    this.hasRange = true;
                    if (domain.indexOf(d.min) < 0) {
                        domain.push(d.min);
                    }
                }
                if (d.max !== undefined) {
                    this.hasRange = true;
                    if (domain.indexOf(d.max) < 0) {
                        domain.push(d.max);
                    }
                }
            }
        }
        var values = domain.slice();
        if (!this.autoScale) {
            values.push(0);
        }
        var min = this.yScaleMin
            ? this.yScaleMin
            : Math.min.apply(Math, values);
        var max = this.yScaleMax
            ? this.yScaleMax
            : Math.max.apply(Math, values);
        return [min, max];
    };
    CustomChartComponent.prototype.getSeriesDomain = function () {
        return this.results.map(function (d) { return d.name; });
    };
    CustomChartComponent.prototype.getXScale = function (domain, width) {
        var scale;
        if (this.scaleType === 'time') {
            scale = Object(__WEBPACK_IMPORTED_MODULE_5_d3_scale__["scaleTime"])()
                .range([0, width])
                .domain(domain);
        }
        else if (this.scaleType === 'linear') {
            scale = Object(__WEBPACK_IMPORTED_MODULE_5_d3_scale__["scaleLinear"])()
                .range([0, width])
                .domain(domain);
            if (this.roundDomains) {
                scale = scale.nice();
            }
        }
        else if (this.scaleType === 'ordinal') {
            scale = Object(__WEBPACK_IMPORTED_MODULE_5_d3_scale__["scalePoint"])()
                .range([0, width])
                .padding(0.1)
                .domain(domain);
        }
        return scale;
    };
    CustomChartComponent.prototype.getYScale = function (domain, height) {
        var scale = Object(__WEBPACK_IMPORTED_MODULE_5_d3_scale__["scaleLinear"])()
            .range([height, 0])
            .domain(domain);
        return this.roundDomains ? scale.nice() : scale;
    };
    CustomChartComponent.prototype.getScaleType = function (values) {
        var date = true;
        var num = true;
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var value = values_1[_i];
            if (!this.isDate(value)) {
                date = false;
            }
            if (typeof value !== 'number') {
                num = false;
            }
        }
        if (date)
            return 'time';
        if (num)
            return 'linear';
        return 'ordinal';
    };
    CustomChartComponent.prototype.isDate = function (value) {
        if (value instanceof Date) {
            return true;
        }
        return false;
    };
    CustomChartComponent.prototype.updateDomain = function (domain) {
        this.filteredDomain = domain;
        this.xDomain = this.filteredDomain;
        this.xScale = this.getXScale(this.xDomain, this.dims.width);
    };
    CustomChartComponent.prototype.updateHoveredVertical = function (item) {
        this.hoveredVertical = item.value;
        this.deactivateAll();
    };
    CustomChartComponent.prototype.hideCircles = function () {
        this.hoveredVertical = null;
        this.deactivateAll();
    };
    CustomChartComponent.prototype.onClick = function (data, series) {
        if (series) {
            data.series = series.name;
        }
        this.select.emit(data);
    };
    CustomChartComponent.prototype.trackBy = function (index, item) {
        return item.name;
    };
    CustomChartComponent.prototype.setColors = function () {
        var domain;
        if (this.schemeType === 'ordinal') {
            domain = this.seriesDomain;
        }
        else {
            domain = this.yDomain;
        }
        this.colors = new __WEBPACK_IMPORTED_MODULE_2__swimlane_ngx_charts__["ColorHelper"](this.scheme, this.schemeType, domain, this.customColors);
    };
    CustomChartComponent.prototype.getLegendOptions = function () {
        var opts = {
            scaleType: this.schemeType,
            colors: undefined,
            domain: [],
            title: undefined
        };
        if (opts.scaleType === 'ordinal') {
            opts.domain = this.seriesDomain;
            opts.colors = this.colors;
            opts.title = this.legendTitle;
        }
        else {
            opts.domain = this.yDomain;
            opts.colors = this.colors.scale;
        }
        return opts;
    };
    CustomChartComponent.prototype.updateYAxisWidth = function (_a) {
        var width = _a.width;
        this.yAxisWidth = width;
        this.update();
    };
    CustomChartComponent.prototype.updateXAxisHeight = function (_a) {
        var height = _a.height;
        this.xAxisHeight = height;
        this.update();
    };
    CustomChartComponent.prototype.onActivate = function (item) {
        this.deactivateAll();
        var idx = this.activeEntries.findIndex(function (d) {
            return d.name === item.name && d.value === item.value;
        });
        if (idx > -1) {
            return;
        }
        this.activeEntries = [item];
        this.activate.emit({ value: item, entries: this.activeEntries });
    };
    CustomChartComponent.prototype.onDeactivate = function (item) {
        var idx = this.activeEntries.findIndex(function (d) {
            return d.name === item.name && d.value === item.value;
        });
        this.activeEntries.splice(idx, 1);
        this.activeEntries = this.activeEntries.slice();
        this.deactivate.emit({ value: item, entries: this.activeEntries });
    };
    CustomChartComponent.prototype.deactivateAll = function () {
        this.activeEntries = this.activeEntries.slice();
        for (var _i = 0, _a = this.activeEntries; _i < _a.length; _i++) {
            var entry = _a[_i];
            this.deactivate.emit({ value: entry, entries: [] });
        }
        this.activeEntries = [];
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartComponent.prototype, "legend", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], CustomChartComponent.prototype, "legendTitle", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartComponent.prototype, "xAxis", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartComponent.prototype, "yAxis", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartComponent.prototype, "showXAxisLabel", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartComponent.prototype, "showYAxisLabel", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartComponent.prototype, "xAxisLabel", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartComponent.prototype, "yAxisLabel", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartComponent.prototype, "autoScale", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartComponent.prototype, "timeline", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], CustomChartComponent.prototype, "gradient", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], CustomChartComponent.prototype, "showGridLines", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartComponent.prototype, "curve", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Array)
    ], CustomChartComponent.prototype, "activeEntries", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], CustomChartComponent.prototype, "schemeType", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Number)
    ], CustomChartComponent.prototype, "rangeFillOpacity", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartComponent.prototype, "xAxisTickFormatting", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartComponent.prototype, "yAxisTickFormatting", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], CustomChartComponent.prototype, "roundDomains", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], CustomChartComponent.prototype, "tooltipDisabled", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], CustomChartComponent.prototype, "showRefLines", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartComponent.prototype, "referenceLines", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], CustomChartComponent.prototype, "showRefLabels", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartComponent.prototype, "xScaleMin", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartComponent.prototype, "xScaleMax", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Number)
    ], CustomChartComponent.prototype, "yScaleMin", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Number)
    ], CustomChartComponent.prototype, "yScaleMax", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"])
    ], CustomChartComponent.prototype, "activate", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"])
    ], CustomChartComponent.prototype, "deactivate", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"])
    ], CustomChartComponent.prototype, "touchEnd", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChild"])('tooltipTemplate'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["TemplateRef"])
    ], CustomChartComponent.prototype, "tooltipTemplate", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChild"])('seriesTooltipTemplate'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["TemplateRef"])
    ], CustomChartComponent.prototype, "seriesTooltipTemplate", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"])('mouseleave'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], CustomChartComponent.prototype, "hideCircles", null);
    CustomChartComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'custom-chart',template:/*ion-inline-start:"/Users/elvis/coding/crypto/src/components/custom-chart/custom-chart.html"*/'<ngx-charts-chart\n  [view]="[width, height]"\n  [showLegend]="legend"\n  [legendOptions]="legendOptions"\n  [activeEntries]="activeEntries"\n  [animations]="animations"\n  (legendLabelClick)="onClick($event)"\n  (legendLabelActivate)="onActivate($event)"\n  (legendLabelDeactivate)="onDeactivate($event)"\n  xmlns:svg="http://www.w3.org/2000/svg">\n  <svg:defs>\n    <svg:clipPath [attr.id]="clipPathId">\n      <svg:rect\n        [attr.width]="dims.width + 10"\n        [attr.height]="dims.height + 10"\n        [attr.transform]="\'translate(-5, -5)\'"/>\n    </svg:clipPath>\n  </svg:defs>\n  <svg:g [attr.transform]="transform" class="line-chart chart">\n    <svg:g ngx-charts-x-axis\n           *ngIf="xAxis"\n           [xScale]="xScale"\n           [dims]="dims"\n           [showGridLines]="showGridLines"\n           [showLabel]="showXAxisLabel"\n           [labelText]="xAxisLabel"\n           [tickFormatting]="xAxisTickFormatting"\n           (dimensionsChanged)="updateXAxisHeight($event)">\n    </svg:g>\n    <svg:g ngx-charts-y-axis\n           *ngIf="yAxis"\n           [yScale]="yScale"\n           [dims]="dims"\n           [showGridLines]="showGridLines"\n           [showLabel]="showYAxisLabel"\n           [labelText]="yAxisLabel"\n           [tickFormatting]="yAxisTickFormatting"\n           [referenceLines]="referenceLines"\n           [showRefLines]="showRefLines"\n           [showRefLabels]="showRefLabels"\n           (dimensionsChanged)="updateYAxisWidth($event)">\n    </svg:g>\n    <svg:g [attr.clip-path]="clipPath">\n      <svg:g *ngFor="let series of results; trackBy:trackBy" [@animationState]="\'active\'">\n        <svg:g custom-chart-line-series\n               [xScale]="xScale"\n               [yScale]="yScale"\n               [colors]="colors"\n               [data]="series"\n               [activeEntries]="activeEntries"\n               [scaleType]="scaleType"\n               [curve]="curve"\n               [rangeFillOpacity]="rangeFillOpacity"\n               [hasRange]="hasRange"\n               [animations]="animations"\n        />\n      </svg:g>\n\n      <svg:g *ngIf="!tooltipDisabled" (mouseleave)="hideCircles()">\n        <svg:g custom-chart-tooltip-area\n               [dims]="dims"\n               [xSet]="xSet"\n               [xScale]="xScale"\n               [yScale]="yScale"\n               [results]="results"\n               [colors]="colors"\n               [tooltipDisabled]="tooltipDisabled"\n               [tooltipTemplate]="seriesTooltipTemplate"\n               (hover)="updateHoveredVertical($event)"\n               (touch)="updateHoveredVertical($event)"\n               (touchEnd)="touchEnd.emit()"\n        />\n\n        <svg:g *ngFor="let series of results">\n          <svg:g custom-chart-circle-series\n                 [xScale]="xScale"\n                 [yScale]="yScale"\n                 [colors]="colors"\n                 [data]="series"\n                 [scaleType]="scaleType"\n                 [visibleValue]="hoveredVertical"\n                 [activeEntries]="activeEntries"\n                 [tooltipDisabled]="tooltipDisabled"\n                 [tooltipTemplate]="tooltipTemplate"\n                 (select)="onClick($event, series)"\n                 (activate)="onActivate($event)"\n                 (deactivate)="onDeactivate($event)"\n          />\n        </svg:g>\n      </svg:g>\n    </svg:g>\n  </svg:g>\n  <svg:g ngx-charts-timeline\n         *ngIf="timeline && scaleType != \'ordinal\'"\n         [attr.transform]="timelineTransform"\n         [results]="results"\n         [view]="[timelineWidth, height]"\n         [height]="timelineHeight"\n         [scheme]="scheme"\n         [customColors]="customColors"\n         [scaleType]="scaleType"\n         [legend]="legend"\n         (onDomainChange)="updateDomain($event)">\n    <svg:g *ngFor="let series of results; trackBy:trackBy">\n      <svg:g ngx-charts-line-series\n             [xScale]="timelineXScale"\n             [yScale]="timelineYScale"\n             [colors]="colors"\n             [data]="series"\n             [scaleType]="scaleType"\n             [curve]="curve"\n             [hasRange]="hasRange"\n             [animations]="animations"\n      />\n    </svg:g>\n  </svg:g>\n</ngx-charts-chart>\n'/*ion-inline-end:"/Users/elvis/coding/crypto/src/components/custom-chart/custom-chart.html"*/,
            encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewEncapsulation"].None,
            changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush,
            animations: [
                Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["trigger"])('animationState', [
                    Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["transition"])(':leave', [
                        Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                            opacity: 1,
                        }),
                        Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["animate"])(500, Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                            opacity: 0
                        }))
                    ])
                ])
            ]
        })
    ], CustomChartComponent);
    return CustomChartComponent;
}(__WEBPACK_IMPORTED_MODULE_2__swimlane_ngx_charts__["BaseChartComponent"]));

//# sourceMappingURL=custom-chart.js.map

/***/ }),

/***/ 801:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustomChartTooltipAreaComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_animations__ = __webpack_require__(49);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var CustomChartTooltipAreaComponent = (function () {
    function CustomChartTooltipAreaComponent(renderer) {
        this.renderer = renderer;
        this.anchorOpacity = 0;
        this.anchorPos = -1;
        this.anchorValues = [];
        this.color = '#f26bf7';
        this.showPercentage = false;
        this.tooltipDisabled = false;
        this.hover = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.touch = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.touchEnd = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
    }
    CustomChartTooltipAreaComponent.prototype.getValues = function (xVal) {
        var results = [];
        for (var _i = 0, _a = this.results; _i < _a.length; _i++) {
            var group = _a[_i];
            var item = group.series.find(function (d) { return d.name.toString() === xVal.toString(); });
            var groupName = group.name;
            if (groupName instanceof Date) {
                groupName = groupName.toLocaleDateString();
            }
            if (item) {
                var label = item.name;
                var val = item.value;
                if (this.showPercentage) {
                    val = (item.d1 - item.d0).toFixed(2) + '%';
                }
                var color = void 0;
                if (this.colors.scaleType === 'linear') {
                    var v = val;
                    if (item.d1) {
                        v = item.d1;
                    }
                    color = this.colors.getColor(v);
                }
                else {
                    color = this.colors.getColor(group.name);
                }
                results.push({
                    value: val,
                    name: label,
                    series: groupName,
                    min: item.min,
                    max: item.max,
                    color: color
                });
            }
        }
        return results;
    };
    CustomChartTooltipAreaComponent.prototype.mouseMove = function (event) {
        var xPos = event.offsetX - this.dims.xOffset;
        var closestIndex = this.findClosestPointIndex(xPos);
        var closestPoint = this.xSet[closestIndex];
        this.anchorPos = this.xScale(closestPoint);
        this.anchorPos = Math.max(0, this.anchorPos);
        this.anchorPos = Math.min(this.dims.width, this.anchorPos) - 1.5;
        this.anchorValues = this.getValues(closestPoint);
        if (this.anchorPos !== this.lastAnchorPos) {
            var ev = new MouseEvent('mouseleave', { bubbles: false });
            this.renderer.invokeElementMethod(this.tooltipAnchor.nativeElement, 'dispatchEvent', [ev]);
            this.anchorOpacity = 0.7;
            this.hover.emit({
                value: closestPoint
            });
            // this.showTooltip();
            this.lastAnchorPos = this.anchorPos;
        }
    };
    CustomChartTooltipAreaComponent.prototype.touchMove = function (event) {
        var xPos = event.targetTouches[0].pageX - this.dims.xOffset;
        var closestIndex = this.findClosestPointIndex(xPos);
        var closestPoint = this.xSet[closestIndex];
        this.anchorPos = this.xScale(closestPoint);
        this.anchorPos = Math.max(0, this.anchorPos);
        this.anchorPos = Math.min(this.dims.width, this.anchorPos) - 1.5;
        this.anchorValues = this.getValues(closestPoint);
        if (this.anchorPos !== this.lastAnchorPos) {
            var ev = new MouseEvent('mouseleave', { bubbles: false });
            this.renderer.invokeElementMethod(this.tooltipAnchor.nativeElement, 'dispatchEvent', [ev]);
            this.anchorOpacity = 0.7;
            this.touch.emit({
                value: closestPoint
            });
            // this.showTooltip();
            this.lastAnchorPos = this.anchorPos;
        }
    };
    CustomChartTooltipAreaComponent.prototype.findClosestPointIndex = function (xPos) {
        var minIndex = 0;
        var maxIndex = this.xSet.length - 1;
        var minDiff = Number.MAX_VALUE;
        var closestIndex = 0;
        while (minIndex <= maxIndex) {
            var currentIndex = (minIndex + maxIndex) / 2 | 0;
            var currentElement = this.xScale(this.xSet[currentIndex]);
            var curDiff = Math.abs(currentElement - xPos);
            if (curDiff < minDiff) {
                minDiff = curDiff;
                closestIndex = currentIndex;
            }
            if (currentElement < xPos) {
                minIndex = currentIndex + 1;
            }
            else if (currentElement > xPos) {
                maxIndex = currentIndex - 1;
            }
            else {
                minDiff = 0;
                closestIndex = currentIndex;
                break;
            }
        }
        return closestIndex;
    };
    CustomChartTooltipAreaComponent.prototype.showTooltip = function () {
        var event = new MouseEvent('mouseenter', { bubbles: false });
        this.renderer.invokeElementMethod(this.tooltipAnchor.nativeElement, 'dispatchEvent', [event]);
    };
    CustomChartTooltipAreaComponent.prototype.hideTooltip = function () {
        var event = new MouseEvent('mouseleave', { bubbles: false });
        this.renderer.invokeElementMethod(this.tooltipAnchor.nativeElement, 'dispatchEvent', [event]);
        this.anchorOpacity = 0;
        this.lastAnchorPos = -1;
        this.touchEnd.emit();
    };
    CustomChartTooltipAreaComponent.prototype.getToolTipText = function (tooltipItem) {
        var result = '';
        if (tooltipItem.series !== undefined) {
            result += tooltipItem.series;
        }
        else {
            result += '???';
        }
        result += ': ';
        if (tooltipItem.value !== undefined) {
            result += tooltipItem.value.toLocaleString();
        }
        if (tooltipItem.min !== undefined || tooltipItem.max !== undefined) {
            result += ' (';
            if (tooltipItem.min !== undefined) {
                if (tooltipItem.max === undefined) {
                    result += '≥';
                }
                result += tooltipItem.min.toLocaleString();
                if (tooltipItem.max !== undefined) {
                    result += ' - ';
                }
            }
            else if (tooltipItem.max !== undefined) {
                result += '≤';
            }
            if (tooltipItem.max !== undefined) {
                result += tooltipItem.max.toLocaleString();
            }
            result += ')';
        }
        return result;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartTooltipAreaComponent.prototype, "dims", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartTooltipAreaComponent.prototype, "xSet", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartTooltipAreaComponent.prototype, "xScale", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartTooltipAreaComponent.prototype, "yScale", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartTooltipAreaComponent.prototype, "results", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartTooltipAreaComponent.prototype, "colors", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], CustomChartTooltipAreaComponent.prototype, "showPercentage", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], CustomChartTooltipAreaComponent.prototype, "tooltipDisabled", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["TemplateRef"])
    ], CustomChartTooltipAreaComponent.prototype, "tooltipTemplate", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", Object)
    ], CustomChartTooltipAreaComponent.prototype, "hover", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", Object)
    ], CustomChartTooltipAreaComponent.prototype, "touch", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", Object)
    ], CustomChartTooltipAreaComponent.prototype, "touchEnd", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('tooltipAnchor'),
        __metadata("design:type", Object)
    ], CustomChartTooltipAreaComponent.prototype, "tooltipAnchor", void 0);
    CustomChartTooltipAreaComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'g[custom-chart-tooltip-area]',template:/*ion-inline-start:"/Users/elvis/coding/crypto/src/components/custom-chart-tooltip-area/custom-chart-tooltip-area.html"*/'<svg:g xmlns:svg="http://www.w3.org/2000/svg">\n  <svg:rect\n    class="tooltip-area"\n    [attr.x]="0"\n    y="0"\n    [attr.width]="dims.width"\n    [attr.height]="dims.height"\n    style="opacity: 0; cursor: \'auto\';"\n    (mousemove)="mouseMove($event)"\n    (touchmove)="touchMove($event)"\n    (touchend)="hideTooltip()"\n    (mouseleave)="hideTooltip()"\n  />\n  <xhtml:ng-template #defaultTooltipTemplate let-model="model" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n    <xhtml:div class="area-tooltip-container">\n      <xhtml:div\n        *ngFor="let tooltipItem of model"\n        class="tooltip-item">\n            <span\n              class="tooltip-item-color"\n              [style.background-color]="tooltipItem.color">\n            </span>\n        {{getToolTipText(tooltipItem)}}\n      </xhtml:div>\n    </xhtml:div>\n  </xhtml:ng-template>\n  <svg:rect\n    #tooltipAnchor\n    [@animationState]="anchorOpacity !== 0 ? \'active\' : \'inactive\'"\n    class="tooltip-anchor"\n    [attr.x]="anchorPos"\n    y="0"\n    [attr.width]="3"\n    [attr.fill]="color"\n    [attr.height]="dims.height"\n    [style.opacity]="anchorOpacity"\n    [style.pointer-events]="\'none\'"\n    ngx-tooltip\n    [tooltipDisabled]="tooltipDisabled"\n    [tooltipPlacement]="\'right\'"\n    [tooltipType]="\'tooltip\'"\n    [tooltipSpacing]="15"\n    [tooltipTemplate]="tooltipTemplate ? tooltipTemplate: defaultTooltipTemplate"\n    [tooltipContext]="anchorValues"\n    [tooltipImmediateExit]="true"\n  />\n</svg:g>\n'/*ion-inline-end:"/Users/elvis/coding/crypto/src/components/custom-chart-tooltip-area/custom-chart-tooltip-area.html"*/,
            changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush,
            animations: [
                Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["trigger"])('animationState', [
                    Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["transition"])('inactive => active', [
                        Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                            opacity: 0,
                        }),
                        Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["animate"])(250, Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({ opacity: 0.7 }))
                    ]),
                    Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["transition"])('active => inactive', [
                        Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                            opacity: 0.7,
                        }),
                        Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["animate"])(250, Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({ opacity: 0 }))
                    ])
                ])
            ]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"]])
    ], CustomChartTooltipAreaComponent);
    return CustomChartTooltipAreaComponent;
}());

//# sourceMappingURL=custom-chart-tooltip-area.js.map

/***/ }),

/***/ 802:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustomChartCircleSeriesComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_animations__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__swimlane_ngx_charts_release_utils__ = __webpack_require__(162);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__swimlane_ngx_charts__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__swimlane_ngx_charts___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__swimlane_ngx_charts__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var CustomChartCircleSeriesComponent = (function () {
    function CustomChartCircleSeriesComponent() {
        this.type = 'standard';
        this.tooltipDisabled = false;
        this.select = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.activate = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.deactivate = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.barVisible = false;
    }
    CustomChartCircleSeriesComponent.prototype.ngOnInit = function () {
        this.gradientId = 'grad' + Object(__WEBPACK_IMPORTED_MODULE_2__swimlane_ngx_charts_release_utils__["a" /* id */])().toString();
        this.gradientFill = "url(#" + this.gradientId + ")";
    };
    CustomChartCircleSeriesComponent.prototype.ngOnChanges = function (changes) {
        this.update();
    };
    CustomChartCircleSeriesComponent.prototype.update = function () {
        this.circles = this.getCircles();
        this.circle = this.circles.find(function (c) {
            return c.opacity !== 0;
        });
    };
    CustomChartCircleSeriesComponent.prototype.getCircles = function () {
        var _this = this;
        var seriesName = this.data.name;
        return this.data.series.map(function (d, i) {
            var value = d.value;
            var label = d.name;
            var tooltipLabel = Object(__WEBPACK_IMPORTED_MODULE_3__swimlane_ngx_charts__["formatLabel"])(label);
            if (value) {
                var cx = void 0;
                if (_this.scaleType === 'time') {
                    cx = _this.xScale(label);
                }
                else if (_this.scaleType === 'linear') {
                    cx = _this.xScale(Number(label));
                }
                else {
                    cx = _this.xScale(label);
                }
                var cy = _this.yScale(_this.type === 'standard' ? value : d.d1);
                var radius = 5;
                var height = _this.yScale.range()[0] - cy;
                var opacity = 0;
                if (label && _this.visibleValue && label.toString() === _this.visibleValue.toString()) {
                    opacity = 0;
                }
                var color = void 0;
                if (_this.colors.scaleType === 'linear') {
                    if (_this.type === 'standard') {
                        color = _this.colors.getColor(value);
                    }
                    else {
                        color = _this.colors.getColor(d.d1);
                    }
                }
                else {
                    color = _this.colors.getColor(seriesName);
                }
                var data = {
                    series: seriesName,
                    value: value,
                    name: label
                };
                if (label && _this.visibleValue && label.toString() === _this.visibleValue.toString()) {
                    _this.select.emit({
                        name: label,
                        value: value
                    });
                }
                return {
                    classNames: ["circle-data-" + i],
                    value: value,
                    label: label,
                    data: data,
                    cx: cx,
                    cy: cy,
                    radius: radius,
                    height: height,
                    tooltipLabel: tooltipLabel,
                    color: color,
                    opacity: opacity,
                    seriesName: seriesName,
                    gradientStops: _this.getGradientStops(color),
                    min: d.min,
                    max: d.max
                };
            }
        }).filter(function (circle) { return circle !== undefined; });
    };
    CustomChartCircleSeriesComponent.prototype.getTooltipText = function (_a) {
        var tooltipLabel = _a.tooltipLabel, value = _a.value, seriesName = _a.seriesName, min = _a.min, max = _a.max;
        return "\n      <span class=\"tooltip-label\">" + seriesName + " \u2022 " + tooltipLabel + "</span>\n      <span class=\"tooltip-val\">" + value.toLocaleString() + this.getTooltipMinMaxText(min, max) + "</span>\n    ";
    };
    CustomChartCircleSeriesComponent.prototype.getTooltipMinMaxText = function (min, max) {
        if (min !== undefined || max !== undefined) {
            var result = ' (';
            if (min !== undefined) {
                if (max === undefined) {
                    result += '≥';
                }
                result += min.toLocaleString();
                if (max !== undefined) {
                    result += ' - ';
                }
            }
            else if (max !== undefined) {
                result += '≤';
            }
            if (max !== undefined) {
                result += max.toLocaleString();
            }
            result += ')';
            return result;
        }
        else {
            return '';
        }
    };
    CustomChartCircleSeriesComponent.prototype.getGradientStops = function (color) {
        return [
            {
                offset: 0,
                color: color,
                opacity: 0.2
            },
            {
                offset: 100,
                color: color,
                opacity: 1
            }
        ];
    };
    CustomChartCircleSeriesComponent.prototype.onClick = function (value, label) {
        this.select.emit({
            name: label,
            value: value
        });
    };
    CustomChartCircleSeriesComponent.prototype.isActive = function (entry) {
        if (!this.activeEntries)
            return false;
        var item = this.activeEntries.find(function (d) {
            return entry.name === d.name;
        });
        return item !== undefined;
    };
    CustomChartCircleSeriesComponent.prototype.activateCircle = function () {
        this.barVisible = true;
        this.activate.emit({ name: this.data.name });
    };
    CustomChartCircleSeriesComponent.prototype.deactivateCircle = function () {
        this.barVisible = false;
        this.circle.opacity = 0;
        this.deactivate.emit({ name: this.data.name });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartCircleSeriesComponent.prototype, "data", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartCircleSeriesComponent.prototype, "type", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartCircleSeriesComponent.prototype, "xScale", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartCircleSeriesComponent.prototype, "yScale", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartCircleSeriesComponent.prototype, "colors", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartCircleSeriesComponent.prototype, "scaleType", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartCircleSeriesComponent.prototype, "visibleValue", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Array)
    ], CustomChartCircleSeriesComponent.prototype, "activeEntries", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], CustomChartCircleSeriesComponent.prototype, "tooltipDisabled", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["TemplateRef"])
    ], CustomChartCircleSeriesComponent.prototype, "tooltipTemplate", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", Object)
    ], CustomChartCircleSeriesComponent.prototype, "select", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", Object)
    ], CustomChartCircleSeriesComponent.prototype, "activate", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", Object)
    ], CustomChartCircleSeriesComponent.prototype, "deactivate", void 0);
    CustomChartCircleSeriesComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'g[custom-chart-circle-series]',template:/*ion-inline-start:"/Users/elvis/coding/crypto/src/components/custom-chart-circle-series/custom-chart-circle-series.html"*/'<svg:g *ngIf="circle" xmlns:svg="http://www.w3.org/2000/svg">\n  <defs>\n    <svg:g ngx-charts-svg-linear-gradient\n           orientation="vertical"\n           [name]="gradientId"\n           [stops]="circle.gradientStops"\n    />\n  </defs>\n  <svg:rect\n    *ngIf="barVisible && type === \'standard\'"\n    [@animationState]="\'active\'"\n    [attr.x]="circle.cx - circle.radius"\n    [attr.y]="circle.cy"\n    [attr.width]="circle.radius * 2"\n    [attr.height]="circle.height"\n    [attr.fill]="gradientFill"\n    class="tooltip-bar"\n  />\n  <svg:g ngx-charts-circle\n         class="circle"\n         [cx]="circle.cx"\n         [cy]="circle.cy"\n         [r]="circle.radius"\n         [fill]="circle.color"\n         [class.active]="isActive({name: circle.seriesName})"\n         [pointerEvents]="circle.value === 0 ? \'none\': \'all\'"\n         [data]="circle.value"\n         [classNames]="circle.classNames"\n         (select)="onClick($event, circle.label)"\n         (activate)="activateCircle()"\n         (deactivate)="deactivateCircle()"\n         ngx-tooltip\n         [tooltipDisabled]="tooltipDisabled"\n         [tooltipPlacement]="\'top\'"\n         [tooltipType]="\'tooltip\'"\n         [tooltipTitle]="tooltipTemplate ? undefined : getTooltipText(circle)"\n         [tooltipTemplate]="tooltipTemplate"\n         [tooltipContext]="circle.data"\n  />\n</svg:g>\n'/*ion-inline-end:"/Users/elvis/coding/crypto/src/components/custom-chart-circle-series/custom-chart-circle-series.html"*/,
            changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush,
            animations: [
                Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["trigger"])('animationState', [
                    Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["transition"])(':enter', [
                        Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                            opacity: 0,
                        }),
                        Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["animate"])(250, Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({ opacity: 1 }))
                    ])
                ])
            ]
        })
    ], CustomChartCircleSeriesComponent);
    return CustomChartCircleSeriesComponent;
}());

//# sourceMappingURL=custom-chart-circle-series.js.map

/***/ }),

/***/ 803:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustomChartLineSeriesComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_d3_shape__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__swimlane_ngx_charts_release_utils__ = __webpack_require__(162);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var CustomChartLineSeriesComponent = (function () {
    function CustomChartLineSeriesComponent() {
        this.animations = true;
    }
    CustomChartLineSeriesComponent.prototype.ngOnChanges = function (changes) {
        this.update();
    };
    CustomChartLineSeriesComponent.prototype.update = function () {
        this.updateGradients();
        var data = this.sortData(this.data.series);
        var lineGen = this.getLineGenerator();
        this.path = lineGen(data) || '';
        var areaGen = this.getAreaGenerator();
        this.areaPath = areaGen(data) || '';
        if (this.hasRange) {
            var range = this.getRangeGenerator();
            this.outerPath = range(data) || '';
        }
        if (this.hasGradient) {
            this.stroke = this.gradientUrl;
            var values = this.data.series.map(function (d) { return d.value; });
            var max = Math.max.apply(Math, values);
            var min = Math.min.apply(Math, values);
            if (max === min) {
                this.stroke = this.colors.getColor(max);
            }
        }
        else {
            this.stroke = this.colors.getColor(this.data.name);
        }
    };
    CustomChartLineSeriesComponent.prototype.getLineGenerator = function () {
        var _this = this;
        return Object(__WEBPACK_IMPORTED_MODULE_1_d3_shape__["line"])()
            .x(function (d) {
            var label = d.name;
            var value;
            if (_this.scaleType === 'time') {
                value = _this.xScale(label);
            }
            else if (_this.scaleType === 'linear') {
                value = _this.xScale(Number(label));
            }
            else {
                value = _this.xScale(label);
            }
            return value;
        })
            .y(function (d) { return _this.yScale(d.value); })
            .curve(this.curve);
    };
    CustomChartLineSeriesComponent.prototype.getRangeGenerator = function () {
        var _this = this;
        return Object(__WEBPACK_IMPORTED_MODULE_1_d3_shape__["area"])()
            .x(function (d) {
            var label = d.name;
            var value;
            if (_this.scaleType === 'time') {
                value = _this.xScale(label);
            }
            else if (_this.scaleType === 'linear') {
                value = _this.xScale(Number(label));
            }
            else {
                value = _this.xScale(label);
            }
            return value;
        })
            .y0(function (d) { return _this.yScale(d.min ? d.min : d.value); })
            .y1(function (d) { return _this.yScale(d.max ? d.max : d.value); })
            .curve(this.curve);
    };
    CustomChartLineSeriesComponent.prototype.getAreaGenerator = function () {
        var _this = this;
        var xProperty = function (d) {
            var label = d.name;
            return _this.xScale(label);
        };
        return Object(__WEBPACK_IMPORTED_MODULE_1_d3_shape__["area"])()
            .x(xProperty)
            .y0(function () { return _this.yScale.range()[0]; })
            .y1(function (d) { return _this.yScale(d.value); })
            .curve(this.curve);
    };
    CustomChartLineSeriesComponent.prototype.sortData = function (data) {
        if (this.scaleType === 'linear') {
            data = Object(__WEBPACK_IMPORTED_MODULE_2__swimlane_ngx_charts_release_utils__["d" /* sortLinear */])(data, 'name');
        }
        else if (this.scaleType === 'time') {
            data = Object(__WEBPACK_IMPORTED_MODULE_2__swimlane_ngx_charts_release_utils__["c" /* sortByTime */])(data, 'name');
        }
        else {
            data = Object(__WEBPACK_IMPORTED_MODULE_2__swimlane_ngx_charts_release_utils__["b" /* sortByDomain */])(data, 'name', 'asc', this.xScale.domain());
        }
        return data;
    };
    CustomChartLineSeriesComponent.prototype.updateGradients = function () {
        if (this.colors.scaleType === 'linear') {
            this.hasGradient = true;
            this.gradientId = 'grad' + Object(__WEBPACK_IMPORTED_MODULE_2__swimlane_ngx_charts_release_utils__["a" /* id */])().toString();
            this.gradientUrl = "url(#" + this.gradientId + ")";
            var values = this.data.series.map(function (d) { return d.value; });
            var max = Math.max.apply(Math, values);
            var min = Math.min.apply(Math, values);
            this.gradientStops = this.colors.getLinearGradientStops(max, min);
            this.areaGradientStops = this.colors.getLinearGradientStops(max);
        }
        else {
            this.hasGradient = false;
            this.gradientStops = undefined;
            this.areaGradientStops = undefined;
        }
    };
    CustomChartLineSeriesComponent.prototype.isActive = function (entry) {
        if (!this.activeEntries)
            return false;
        var item = this.activeEntries.find(function (d) {
            return entry.name === d.name;
        });
        return item !== undefined;
    };
    CustomChartLineSeriesComponent.prototype.isInactive = function (entry) {
        if (!this.activeEntries || this.activeEntries.length === 0)
            return false;
        var item = this.activeEntries.find(function (d) {
            return entry.name === d.name;
        });
        return item === undefined;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartLineSeriesComponent.prototype, "data", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartLineSeriesComponent.prototype, "xScale", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartLineSeriesComponent.prototype, "yScale", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartLineSeriesComponent.prototype, "colors", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartLineSeriesComponent.prototype, "scaleType", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartLineSeriesComponent.prototype, "curve", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Array)
    ], CustomChartLineSeriesComponent.prototype, "activeEntries", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Number)
    ], CustomChartLineSeriesComponent.prototype, "rangeFillOpacity", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], CustomChartLineSeriesComponent.prototype, "hasRange", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], CustomChartLineSeriesComponent.prototype, "animations", void 0);
    CustomChartLineSeriesComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'g[custom-chart-line-series]',template:/*ion-inline-start:"/Users/elvis/coding/crypto/src/components/custom-chart-line-series/custom-chart-line-series.html"*/'<svg:g xmlns:svg="http://www.w3.org/2000/svg">\n  <defs>\n    <svg:g ngx-charts-svg-linear-gradient *ngIf="hasGradient"\n           orientation="vertical"\n           [name]="gradientId"\n           [stops]="gradientStops"\n    />\n  </defs>\n  <svg:g ngx-charts-area\n         class="line-highlight"\n         [data]="data"\n         [path]="areaPath"\n         [fill]="hasGradient ? gradientUrl : colors.getColor(data.name)"\n         [opacity]="0"\n         [startOpacity]="0"\n         [gradient]="true"\n         [stops]="areaGradientStops"\n         [class.active]="isActive(data)"\n         [class.inactive]="isInactive(data)"\n  />\n  <svg:g custom-chart-line\n         class="line-series"\n         [data]="data"\n         [path]="path"\n         [stroke]="stroke"\n         [animations]="animations"\n         [class.active]="isActive(data)"\n         [class.inactive]="isInactive(data)"\n  />\n  <svg:g ngx-charts-area\n         *ngIf="hasRange"\n         class="line-series-range"\n         [data]="data"\n         [path]="outerPath"\n         [fill]="hasGradient ? gradientUrl : colors.getColor(data.name)"\n         [class.active]="isActive(data)"\n         [class.inactive]="isInactive(data)"\n         [opacity]="rangeFillOpacity"\n         [animations]="animations"\n  />\n</svg:g>\n'/*ion-inline-end:"/Users/elvis/coding/crypto/src/components/custom-chart-line-series/custom-chart-line-series.html"*/,
            changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
        })
    ], CustomChartLineSeriesComponent);
    return CustomChartLineSeriesComponent;
}());

//# sourceMappingURL=custom-chart-line-series.js.map

/***/ }),

/***/ 804:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustomChartLineComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_animations__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_d3_selection__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_d3_transition_index__ = __webpack_require__(400);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var CustomChartLineComponent = (function () {
    function CustomChartLineComponent(element) {
        this.element = element;
        this.fill = 'none';
        this.animations = true;
        this.select = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.initialized = false;
    }
    CustomChartLineComponent.prototype.ngOnChanges = function (changes) {
        if (!this.initialized) {
            this.initialized = true;
            this.initialPath = this.path;
        }
        else {
            this.updatePathEl();
        }
    };
    CustomChartLineComponent.prototype.updatePathEl = function () {
        var node = Object(__WEBPACK_IMPORTED_MODULE_2_d3_selection__["select"])(this.element.nativeElement).select('.line');
        if (this.animations) {
            node
                .transition().duration(750)
                .attr('d', this.path);
        }
        else {
            node.attr('d', this.path);
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartLineComponent.prototype, "path", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartLineComponent.prototype, "stroke", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CustomChartLineComponent.prototype, "data", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], CustomChartLineComponent.prototype, "fill", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], CustomChartLineComponent.prototype, "animations", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", Object)
    ], CustomChartLineComponent.prototype, "select", void 0);
    CustomChartLineComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'g[custom-chart-line]',template:/*ion-inline-start:"/Users/elvis/coding/crypto/src/components/custom-chart-line/custom-chart-line.html"*/'<svg:path\n  [@animationState]="\'active\'"\n  class="line"\n  [attr.d]="initialPath"\n  [attr.fill]="fill"\n  [attr.stroke]="stroke"\n  stroke-width="3px"\n  xmlns:svg="http://www.w3.org/2000/svg"\n/>\n'/*ion-inline-end:"/Users/elvis/coding/crypto/src/components/custom-chart-line/custom-chart-line.html"*/,
            changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush,
            animations: [
                Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["trigger"])('animationState', [
                    Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["transition"])(':enter', [
                        Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                            strokeDasharray: 2000,
                            strokeDashoffset: 2000,
                        }),
                        Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["animate"])(1000, Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                            strokeDashoffset: 0
                        }))
                    ])
                ])
            ]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"]])
    ], CustomChartLineComponent);
    return CustomChartLineComponent;
}());

//# sourceMappingURL=custom-chart-line.js.map

/***/ }),

/***/ 805:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChartjsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js__ = __webpack_require__(806);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_chart_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_chart_js__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ChartjsComponent = (function () {
    function ChartjsComponent() {
        this.isLoading = true;
        this.requestAnimation = null;
        this.price = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.date = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
    }
    ChartjsComponent.prototype.ngOnInit = function () {
    };
    ChartjsComponent.prototype.ngOnChanges = function (changes) {
        this.destroyChart();
        var chartDataExists = changes.data.currentValue && changes.data.currentValue.labels.length > 0 && changes.data.currentValue.data.length > 0;
        if (chartDataExists) {
            this.isLoading = false;
            this.chartJS(changes.data.currentValue.labels, changes.data.currentValue.data);
        }
        else {
            this.isLoading = true;
        }
    };
    ChartjsComponent.prototype.ngOnDestroy = function () {
        this.destroyChart();
    };
    ChartjsComponent.prototype.chartJS = function (labels, data) {
        this.chartjs = new __WEBPACK_IMPORTED_MODULE_2_chart_js___default.a(this.canvas.nativeElement, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                        data: data,
                        backgroundColor: [
                            'transparent',
                        ],
                        borderColor: [
                            // TODO Different theme colors
                            'rgba(114, 78, 94, 1)',
                            'rgba(78, 105, 141, 1)',
                            'rgba(159, 228, 32, 1)',
                            'rgba(228, 107, 32, 1)',
                            'rgba(228, 32, 110, 1)',
                        ],
                        borderWidth: 3,
                        pointRadius: 0,
                    }]
            },
            options: this.chartJsOptions()
        });
        this.canvasClientWidth = this.chartjs.canvas.clientWidth;
        this.canvasClientHeight = this.chartjs.canvas.clientHeight;
        this.getAllTickPositions();
    };
    ChartjsComponent.prototype.getAllTickPositions = function () {
        var _this = this;
        var data = this.chartjs.config.data.datasets[0]['_meta'];
        var firstKey = Object.keys(data)[0];
        var ticksArray = data[firstKey]['data'];
        this.allTicksPositions = ticksArray.map(function (item) {
            return {
                index: item['_index'],
                x: item['_model'].x,
                y: item['_model'].y,
                labels: _this.chartjs.data.labels[item['_index']],
                value: _this.chartjs.data.datasets[0].data[item['_index']],
            };
        });
        this.calculateCoordinates(this.allTicksPositions[this.allTicksPositions.length - 1]);
    };
    ChartjsComponent.prototype.setScrubberPosition = function (evt) {
        var _this = this;
        var range = this.calculateRange();
        var targetTouch = evt.targetTouches[0];
        var xPos = Math.round(targetTouch.pageX);
        this.allTicksPositions.find(function (tick) {
            // console.log((xPos >= (tick.x - range) && xPos <= (tick.x + range)) + '--xPos: ' + xPos + ' --tick.x: ' + tick.x + '--range: ' + Math.floor(range));
            if (xPos >= (tick.x - range) && xPos <= (tick.x + range)) {
                _this.currentTick = tick;
                _this.calculateCoordinates(tick, function () {
                    _this.updatePriceAndDate(tick.labels, tick.value);
                });
            }
        });
    };
    ChartjsComponent.prototype.calculateRange = function () {
        var range = ((this.allTicksPositions[1].x - this.allTicksPositions[0].x) / 2);
        return range >= 0 ? range : 0;
    };
    ChartjsComponent.prototype.glideToOriginalPosition = function () {
        var _this = this;
        var range = this.calculateRange();
        var isLastTick = false;
        var lastTickPositionReached = false;
        var speed = 6;
        var fps = 30;
        var then = Date.now();
        var interval = 1000 / fps;
        var now;
        var delta;
        var boundry = 0 - (this.scrubberX.nativeElement.clientWidth / 2);
        var animate = function () {
            now = Date.now();
            delta = now - then;
            if (delta > interval) {
                _this.scrubberXPos = _this.scrubberXPos - speed;
                if (isLastTick) {
                    lastTickPositionReached = _this.scrubberXPos === 0 - (_this.scrubberX.nativeElement.clientWidth / 2);
                }
                else {
                    var originalXPos_1 = _this.canvasClientWidth - _this.scrubberXPos;
                    _this.allTicksPositions.find(function (tick) {
                        if (originalXPos_1 >= (tick.x - range) && originalXPos_1 <= (tick.x + range)) {
                            _this.currentTick = tick;
                            _this.scrubberYPos = tick.y;
                            _this.updatePriceAndDate(tick.labels, tick.value);
                            isLastTick = _this.allTicksPositions.indexOf(_this.currentTick) === 0;
                        }
                    });
                }
            }
            if (!lastTickPositionReached && _this.scrubberXPos > boundry && _this.scrubberXPos > -50) {
                _this.requestAnimation = requestAnimationFrame(animate);
            }
            else {
                cancelAnimationFrame(_this.requestAnimation);
                _this.resetDateAndPrice();
            }
        };
        this.requestAnimation = requestAnimationFrame(animate);
    };
    ChartjsComponent.prototype.resetDateAndPrice = function () {
        this.price.emit(null);
        this.date.emit(null);
    };
    ChartjsComponent.prototype.calculateCoordinates = function (tick, next) {
        if (this.scrubberX && this.scrubberY) {
            this.scrubberXPos = (this.canvasClientWidth - tick.x) - (this.scrubberX.nativeElement.clientWidth / 2);
            this.scrubberYPos = tick.y;
            if (next) {
                next();
            }
        }
    };
    ChartjsComponent.prototype.onScrubStart = function (event) {
        cancelAnimationFrame(this.requestAnimation);
        this.setScrubberPosition(event);
    };
    ChartjsComponent.prototype.onScrubMove = function (event) {
        cancelAnimationFrame(this.requestAnimation);
        this.setScrubberPosition(event);
    };
    ChartjsComponent.prototype.onScrubEnd = function (event) {
        this.glideToOriginalPosition();
    };
    ChartjsComponent.prototype.destroyChart = function () {
        if (!!this.chartjs) {
            this.chartjs.destroy();
            this.chartjs = null;
        }
    };
    ChartjsComponent.prototype.updatePriceAndDate = function (label, value) {
        if (label && value) {
            var timestamp = __WEBPACK_IMPORTED_MODULE_1_moment__["unix"](label).format("DD-MM-YYYY HH:mm");
            this.price.emit(value);
            this.date.emit(timestamp);
        }
    };
    ChartjsComponent.prototype.chartJsOptions = function () {
        return {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            elements: {
                line: {
                    tension: 0.2
                },
                point: {
                    radius: 0,
                    hitRadius: 0,
                    hoverRadius: 0
                }
            },
            tooltips: {
                enabled: false,
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(122,122,122,0.8)',
                callbacks: {
                    labelTextColor: function (item, chart) {
                        console.log(item, chart);
                    }
                },
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                yAxes: [{
                        display: false,
                        scaleLabel: {
                            display: false,
                        },
                        ticks: {
                            beginAtZero: false
                        }
                    }],
                xAxes: [{
                        display: false,
                        scaleLabel: {
                            display: false,
                        },
                        ticks: {
                            display: false,
                            beginAtZero: true,
                        },
                        distribution: 'series',
                        time: {
                            unit: 'hour',
                            displayFormats: {
                                quarter: 'h:mm a'
                            }
                        },
                        gridLines: {
                            display: true,
                            lineWidth: 1,
                            drawBorder: false,
                            drawOnChartArea: true,
                            drawTicks: true,
                            color: "rgba(255, 255, 255, 0.4)",
                        }
                    }]
            }
        };
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], ChartjsComponent.prototype, "data", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('canvas'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"])
    ], ChartjsComponent.prototype, "canvas", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('scrubberX'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"])
    ], ChartjsComponent.prototype, "scrubberX", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('scrubberY'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"])
    ], ChartjsComponent.prototype, "scrubberY", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('chart'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"])
    ], ChartjsComponent.prototype, "chart", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", Object)
    ], ChartjsComponent.prototype, "price", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", Object)
    ], ChartjsComponent.prototype, "date", void 0);
    ChartjsComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'chartjs',template:/*ion-inline-start:"/Users/elvis/coding/crypto/src/components/chartjs/chartjs.html"*/'<div #chart class="custom-chart"\n     (touchstart)="onScrubStart($event)"\n     (touchmove)="onScrubMove($event)"\n     (touchend)="onScrubEnd($event)">\n  <canvas #canvas id="myChart"></canvas>\n  <div #scrubberX class="scrubberX" [style.right]="scrubberXPos + \'px\'">\n    <div #scrubberY class="scrubberY" [style.height]="scrubberYPos + \'px\'"></div>\n  </div>\n  <ion-spinner *ngIf="isLoading" name="crescent"></ion-spinner>\n</div>\n'/*ion-inline-end:"/Users/elvis/coding/crypto/src/components/chartjs/chartjs.html"*/
        }),
        __metadata("design:paramtypes", [])
    ], ChartjsComponent);
    return ChartjsComponent;
}());

//# sourceMappingURL=chartjs.js.map

/***/ }),

/***/ 853:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NgxChartComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_d3_shape__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_moment__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var NgxChartComponent = (function () {
    function NgxChartComponent(cdRef) {
        this.cdRef = cdRef;
        this.view = undefined;
        this.showXAxis = false;
        this.showYAxis = false;
        this.gradient = false;
        this.showLegend = false;
        this.showXAxisLabel = false;
        this.showYAxisLabel = false;
        this.curve = __WEBPACK_IMPORTED_MODULE_1_d3_shape__["curveNatural"];
        this.colorScheme = {
            domain: ['#2a95da']
        };
        this.autoScale = true;
        this.price = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.date = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
    }
    NgxChartComponent.prototype.ngOnChanges = function (changes) {
        if (!!changes.data.currentValue) {
        }
    };
    NgxChartComponent.prototype.onScrub = function (event, serie) {
        var timestamp = __WEBPACK_IMPORTED_MODULE_2_moment__["unix"](event.name).format("DD-MM-YYYY HH:mm");
        this.price.emit(event.value);
        this.date.emit(timestamp);
        this.cdRef.detectChanges();
    };
    NgxChartComponent.prototype.onScrubEnd = function () {
        this.price.emit(null);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], NgxChartComponent.prototype, "data", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", Object)
    ], NgxChartComponent.prototype, "price", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", Object)
    ], NgxChartComponent.prototype, "date", void 0);
    NgxChartComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'ngx-chart',template:/*ion-inline-start:"/Users/elvis/coding/crypto/src/components/ngx-chart/ngx-chart.html"*/'<custom-chart *ngIf="!!priceHistoryList; else noChart"\n              [view]="view"\n              [scheme]="colorScheme"\n              [results]="data"\n              [gradient]="gradient"\n              [xAxis]="showXAxis"\n              [yAxis]="showYAxis"\n              [legend]="showLegend"\n              [showXAxisLabel]="showXAxisLabel"\n              [showYAxisLabel]="showYAxisLabel"\n              [autoScale]="autoScale"\n              [timeline]="false"\n              [curve]="curve"\n              (select)="onScrub($event)"\n              (touchEnd)="onScrubEnd()">\n</custom-chart>\n<!--<div *ngIf="timestamp" class="timestamp">{{timestamp}}</div>-->\n<ng-template #noChart>\n  <ion-spinner name="crescent"></ion-spinner>\n</ng-template>\n'/*ion-inline-end:"/Users/elvis/coding/crypto/src/components/ngx-chart/ngx-chart.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]])
    ], NgxChartComponent);
    return NgxChartComponent;
}());

//# sourceMappingURL=ngx-chart.js.map

/***/ }),

/***/ 854:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComparisonUtils; });
var ComparisonUtils = (function () {
    function ComparisonUtils() {
    }
    ComparisonUtils.compareNames = function (a, b) {
        if (a.name < b.name)
            return -1;
        if (a.name > b.name)
            return 1;
        return 0;
    };
    ComparisonUtils.comparePrices = function (a, b) {
        if (parseFloat(a.price) > parseFloat(b.price))
            return -1;
        if (parseFloat(a.price) < parseFloat(b.price))
            return 1;
        return 0;
    };
    ComparisonUtils.compareMarketCap = function (a, b) {
        if (parseFloat(a.marketcap) > parseFloat(b.marketcap))
            return -1;
        if (parseFloat(a.marketcap) < parseFloat(b.marketcap))
            return 1;
        return 0;
    };
    ComparisonUtils.compareOrder = function (a, b) {
        if (Number(a.order) < Number(b.order))
            return -1;
        if (Number(a.order) > Number(b.order))
            return 1;
        return 0;
    };
    return ComparisonUtils;
}());

//# sourceMappingURL=comparison.utils.js.map

/***/ }),

/***/ 874:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 877:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CCC; });
var CCC;
CCC = CCC || {};
CCC.STATIC = CCC.STATIC || {};
CCC.STATIC.TYPE = {
    'TRADE': '0',
    'FEEDNEWS': '1',
    'CURRENT': '2',
    'LOADCOMPLATE': '3',
    'COINPAIRS': '4',
    'CURRENTAGG': '5',
    'TOPLIST': '6',
    'TOPLISTCHANGE': '7',
    'ORDERBOOK': '8',
    'FULLORDERBOOK': '9',
    'ACTIVATION': '10',
    'TRADECATCHUP': '100',
    'NEWSCATCHUP': '101',
    'TRADECATCHUPCOMPLETE': '300',
    'NEWSCATCHUPCOMPLETE': '301'
};
CCC.STATIC.CURRENCY = CCC.STATIC.CURRENCY || {};
CCC.STATIC.CURRENCY.SYMBOL = {
    'BTC': 'Ƀ',
    'LTC': 'Ł',
    'DAO': 'Ð',
    'USD': '$',
    'CNY': '¥',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'PLN': 'zł',
    'RUB': '₽',
    'ETH': 'Ξ',
    'GOLD': 'Gold g',
    'INR': '₹',
    'BRL': 'R$'
};
CCC.STATIC.CURRENCY.getSymbol = function (symbol) {
    return CCC.STATIC.CURRENCY.SYMBOL[symbol] || symbol;
};
CCC.STATIC.UTIL = {
    exchangeNameMapping: {
        'CCCAGG': 'CryptoCompare Index',
        'BTCChina': 'BTCC'
    },
    isMobile: function (userAgent) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4)))
            return true;
        return false;
    },
    convertToMB: function (bytes) {
        return (parseInt(bytes, 10) / 1024 / 1024).toFixed(2) + ' MB';
    },
    getNameForExchange: function (exchangeName) {
        if (this.exchangeNameMapping.hasOwnProperty(exchangeName)) {
            return this.exchangeNameMapping[exchangeName];
        }
        return exchangeName;
    },
    noExponents: function (value) {
        var data = String(value).split(/[eE]/);
        if (data.length == 1)
            return data[0];
        var z = '', sign = value < 0 ? '-' : '', str = data[0].replace('.', ''), mag = Number(data[1]) + 1;
        if (mag < 0) {
            z = sign + '0.';
            while (mag++)
                z += '0';
            return z + str.replace(/^\-/, '');
        }
        mag -= str.length;
        while (mag--)
            z += '0';
        return str + z;
    },
    reduceFloatVal: function (value) {
        value = parseFloat(value);
        if (value > 1) {
            value = Math.round(value * 100) / 100;
            return value;
        }
        if (value >= 0.00001000) {
            return parseFloat(value.toPrecision(4));
        }
        if (value >= 0.00000100) {
            return parseFloat(value.toPrecision(3));
        }
        if (value >= 0.00000010) {
            return parseFloat(value.toPrecision(2));
        }
        return parseFloat(value.toPrecision(1));
    },
    reduceReal: function (value) {
        value = parseFloat(value);
        return parseFloat(value.toFixed(8));
    },
    convertCurrentKeyToAll: function (key) {
        var valuesArray = key.split("~");
        valuesArray[0] = CCC.STATIC.TYPE.CURRENTAGG;
        valuesArray[1] = 'CCCAGG';
        return valuesArray.join('~');
    },
    convertCurrentKeyToTrade: function (key) {
        var valuesArray = key.split("~");
        valuesArray[0] = CCC.STATIC.TYPE.TRADE;
        return valuesArray.join('~');
    },
    convertValueToDisplay: function (symbol, value, filterNumberFunctionAngularJS, type, fullNumbers) {
        var prefix = '';
        var valueSign = 1;
        value = parseFloat(value);
        var valueAbs = Math.abs(value);
        var decimalsOnBigNumbers = 2;
        var decimalsOnNormalNumbers = 2;
        var decimalsOnSmallNumbers = 4;
        if (fullNumbers === true) {
            decimalsOnBigNumbers = 2;
            decimalsOnNormalNumbers = 0;
            decimalsOnSmallNumbers = 4;
        }
        if (type == "8decimals") {
            decimalsOnBigNumbers = 4;
            decimalsOnNormalNumbers = 8;
            decimalsOnSmallNumbers = 8;
            if (value < 0.0001 && value >= 0.00001) {
                decimalsOnSmallNumbers = 4;
            }
            if (value < 0.001 && value >= 0.0001) {
                decimalsOnSmallNumbers = 5;
            }
            if (value < 0.01 && value >= 0.001) {
                decimalsOnSmallNumbers = 6;
            }
            if (value < 0.1 && value >= 0.01) {
                decimalsOnSmallNumbers = 7;
            }
        }
        if (symbol != '') {
            prefix = symbol + ' ';
        }
        if (value < 0) {
            valueSign = -1;
        }
        if (value == 0) {
            return prefix + '0';
        }
        if (value < 0.00001000 && value >= 0.00000100 && decimalsOnSmallNumbers > 3) {
            decimalsOnSmallNumbers = 3;
        }
        if (value < 0.00000100 && value >= 0.00000010 && decimalsOnSmallNumbers > 2) {
            decimalsOnSmallNumbers = 2;
        }
        if (value < 0.00000010 && decimalsOnSmallNumbers > 1) {
            decimalsOnSmallNumbers = 1;
        }
        if (type == "short" || type == "8decimals") {
            if (valueAbs > 10000000000) {
                valueAbs = valueAbs / 1000000000;
                return prefix + filterNumberFunctionAngularJS(valueSign * valueAbs, decimalsOnBigNumbers) + ' B';
            }
            if (valueAbs > 10000000) {
                valueAbs = valueAbs / 1000000;
                return prefix + filterNumberFunctionAngularJS(valueSign * valueAbs, decimalsOnBigNumbers) + ' M';
            }
            if (valueAbs > 10000) {
                valueAbs = valueAbs / 1000;
                return prefix + filterNumberFunctionAngularJS(valueSign * valueAbs, decimalsOnBigNumbers) + ' K';
            }
            if (type == "8decimals" && valueAbs >= 100) {
                return prefix + filterNumberFunctionAngularJS(valueSign * valueAbs, decimalsOnBigNumbers);
            }
            if (valueAbs >= 1) {
                return prefix + filterNumberFunctionAngularJS(valueSign * valueAbs, decimalsOnNormalNumbers);
            }
            return prefix + (valueSign * valueAbs).toPrecision(decimalsOnSmallNumbers);
        }
        else {
            if (valueAbs >= 1) {
                return prefix + filterNumberFunctionAngularJS(valueSign * valueAbs, decimalsOnNormalNumbers);
            }
            return prefix + this.noExponents((valueSign * valueAbs).toPrecision(decimalsOnSmallNumbers));
        }
    }
};
CCC.TRADE = CCC.TRADE || {};
/*
trade fields binary values always in the last ~
*/
CCC.TRADE.FLAGS = {
    'SELL': 0x1 // hex for binary 1
    ,
    'BUY': 0x2 // hex for binary 10
    ,
    'UNKNOWN': 0x4 // hex for binary 100
};
CCC.TRADE.FIELDS = {
    'T': 0x0 // hex for binary 0, it is a special case of fields that are always there TYPE
    ,
    'M': 0x0 // hex for binary 0, it is a special case of fields that are always there MARKET
    ,
    'FSYM': 0x0 // hex for binary 0, it is a special case of fields that are always there FROM SYMBOL
    ,
    'TSYM': 0x0 // hex for binary 0, it is a special case of fields that are always there TO SYMBOL
    ,
    'F': 0x0 // hex for binary 0, it is a special case of fields that are always there FLAGS
    ,
    'ID': 0x1 // hex for binary 1                                                       ID
    ,
    'TS': 0x2 // hex for binary 10                                                      TIMESTAMP
    ,
    'Q': 0x4 // hex for binary 100                                                     QUANTITY
    ,
    'P': 0x8 // hex for binary 1000                                                    PRICE
    ,
    'TOTAL': 0x10 // hex for binary 10000                                                   TOTAL
};
CCC.TRADE.DISPLAY = CCC.TRADE.DISPLAY || {};
CCC.TRADE.DISPLAY.FIELDS = {
    'T': { "Show": false },
    'M': { "Show": true, 'Filter': 'Market' },
    'FSYM': { "Show": true, 'Filter': 'CurrencySymbol' },
    'TSYM': { "Show": true, 'Filter': 'CurrencySymbol' },
    'F': { "Show": true, 'Filter': 'TradeFlag' },
    'ID': { "Show": true, 'Filter': 'Text' },
    'TS': { 'Show': true, 'Filter': 'Date', 'Format': 'yyyy MMMM dd HH:mm:ss' },
    'Q': { 'Show': true, 'Filter': 'Number', 'Symbol': 'FSYM' },
    'P': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TSYM' },
    'TOTAL': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TSYM' }
};
CCC.TRADE.pack = function (tradeObject) {
    var mask = 0;
    var packedTrade = '';
    for (var field in tradeObject) {
        packedTrade += '~' + tradeObject[field];
        mask |= this.FIELDS[field];
    }
    return packedTrade.substr(1) + '~' + mask.toString(16);
};
CCC.TRADE.unpack = function (tradeString) {
    var valuesArray = tradeString.split("~");
    var valuesArrayLenght = valuesArray.length;
    var mask = valuesArray[valuesArrayLenght - 1];
    var maskInt = parseInt(mask, 16);
    var unpackedTrade = {};
    var currentField = 0;
    for (var property in this.FIELDS) {
        if (this.FIELDS[property] === 0) {
            unpackedTrade[property] = valuesArray[currentField];
            currentField++;
        }
        else if (maskInt & this.FIELDS[property]) {
            unpackedTrade[property] = valuesArray[currentField];
            currentField++;
        }
    }
    return unpackedTrade;
};
CCC.TRADE.getKey = function (tradeObject) {
    return tradeObject['T'] + '~' + tradeObject['M'] + '~' + tradeObject['FSYM'] + '~' + tradeObject['TSYM'];
};
CCC.CURRENT = CCC.CURRENT || {};
/*
current fields mask values always in the last ~
*/
CCC.CURRENT.FLAGS = {
    'PRICEUP': 0x1 // hex for binary 1
    ,
    'PRICEDOWN': 0x2 // hex for binary 10
    ,
    'PRICEUNCHANGED': 0x4 // hex for binary 100
    ,
    'BIDUP': 0x8 // hex for binary 1000
    ,
    'BIDDOWN': 0x10 // hex for binary 10000
    ,
    'BIDUNCHANGED': 0x20 // hex for binary 100000
    ,
    'OFFERUP': 0x40 // hex for binary 1000000
    ,
    'OFFERDOWN': 0x80 // hex for binary 10000000
    ,
    'OFFERUNCHANGED': 0x100 // hex for binary 100000000
    ,
    'AVGUP': 0x200 // hex for binary 1000000000
    ,
    'AVGDOWN': 0x400 // hex for binary 10000000000
    ,
    'AVGUNCHANGED': 0x800 // hex for binary 100000000000
};
CCC.CURRENT.FIELDS = {
    'TYPE': 0x0 // hex for binary 0, it is a special case of fields that are always there
    ,
    'MARKET': 0x0 // hex for binary 0, it is a special case of fields that are always there
    ,
    'FROMSYMBOL': 0x0 // hex for binary 0, it is a special case of fields that are always there
    ,
    'TOSYMBOL': 0x0 // hex for binary 0, it is a special case of fields that are always there
    ,
    'FLAGS': 0x0 // hex for binary 0, it is a special case of fields that are always there
    ,
    'PRICE': 0x1 // hex for binary 1
    ,
    'BID': 0x2 // hex for binary 10
    ,
    'OFFER': 0x4 // hex for binary 100
    ,
    'LASTUPDATE': 0x8 // hex for binary 1000
    ,
    'AVG': 0x10 // hex for binary 10000
    ,
    'LASTVOLUME': 0x20 // hex for binary 100000
    ,
    'LASTVOLUMETO': 0x40 // hex for binary 1000000
    ,
    'LASTTRADEID': 0x80 // hex for binary 10000000
    ,
    'VOLUMEHOUR': 0x100 // hex for binary 100000000
    ,
    'VOLUMEHOURTO': 0x200 // hex for binary 1000000000
    ,
    'VOLUME24HOUR': 0x400 // hex for binary 10000000000
    ,
    'VOLUME24HOURTO': 0x800 // hex for binary 100000000000
    ,
    'OPENHOUR': 0x1000 // hex for binary 1000000000000
    ,
    'HIGHHOUR': 0x2000 // hex for binary 10000000000000
    ,
    'LOWHOUR': 0x4000 // hex for binary 100000000000000
    ,
    'OPEN24HOUR': 0x8000 // hex for binary 1000000000000000
    ,
    'HIGH24HOUR': 0x10000 // hex for binary 10000000000000000
    ,
    'LOW24HOUR': 0x20000 // hex for binary 100000000000000000
    ,
    'LASTMARKET': 0x40000 // hex for binary 1000000000000000000, this is a special case and will only appear on CCCAGG messages
};
CCC.CURRENT.DISPLAY = CCC.CURRENT.DISPLAY || {};
CCC.CURRENT.DISPLAY.FIELDS = {
    'TYPE': { 'Show': false },
    'MARKET': { 'Show': true, 'Filter': 'Market' },
    'FROMSYMBOL': { 'Show': false },
    'TOSYMBOL': { 'Show': false },
    'FLAGS': { 'Show': false },
    'PRICE': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'BID': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'OFFER': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'LASTUPDATE': { 'Show': true, 'Filter': 'Date', 'Format': 'yyyy MMMM dd HH:mm:ss' },
    'AVG': { 'Show': true, ' Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'LASTVOLUME': { 'Show': true, 'Filter': 'Number', 'Symbol': 'FROMSYMBOL' },
    'LASTVOLUMETO': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'LASTTRADEID': { 'Show': true, 'Filter': 'String' },
    'VOLUMEHOUR': { 'Show': true, 'Filter': 'Number', 'Symbol': 'FROMSYMBOL' },
    'VOLUMEHOURTO': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'VOLUME24HOUR': { 'Show': true, 'Filter': 'Number', 'Symbol': 'FROMSYMBOL' },
    'VOLUME24HOURTO': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'OPENHOUR': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'HIGHHOUR': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'LOWHOUR': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'OPEN24HOUR': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'HIGH24HOUR': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'LOW24HOUR': { 'Show': true, 'Filter': 'Number', 'Symbol': 'TOSYMBOL' },
    'LASTMARKET': { 'Show': true, 'Filter': 'String' }
};
CCC.CURRENT.pack = function (currentObject) {
    var mask = 0;
    var packedCurrent = '';
    for (var property in this.FIELDS) {
        if (currentObject.hasOwnProperty(property)) {
            packedCurrent += '~' + currentObject[property];
            mask |= this.FIELDS[property];
        }
    }
    //removing first character beacsue it is a ~
    return packedCurrent.substr(1) + '~' + mask.toString(16);
};
CCC.CURRENT.unpack = function (value) {
    var valuesArray = value.split("~");
    var valuesArrayLenght = valuesArray.length;
    var mask = valuesArray[valuesArrayLenght - 1];
    var maskInt = parseInt(mask, 16);
    var unpackedCurrent = {};
    var currentField = 0;
    for (var property in this.FIELDS) {
        if (this.FIELDS[property] === 0) {
            unpackedCurrent[property] = valuesArray[currentField];
            currentField++;
        }
        else if (maskInt & this.FIELDS[property]) {
            //i know this is a hack, for cccagg, future code please don't hate me:(, i did this to avoid
            //subscribing to trades as well in order to show the last market
            if (property === 'LASTMARKET') {
                unpackedCurrent[property] = valuesArray[currentField];
            }
            else {
                unpackedCurrent[property] = parseFloat(valuesArray[currentField]);
            }
            currentField++;
        }
    }
    return unpackedCurrent;
};
CCC.CURRENT.getKey = function (currentObject) {
    return currentObject['TYPE'] + '~' + currentObject['MARKET'] + '~' + currentObject['FROMSYMBOL'] + '~' + currentObject['TOSYMBOL'];
};
CCC.CURRENT.getKeyFromStreamerData = function (streamerData) {
    var valuesArray = streamerData.split("~");
    return valuesArray[0] + '~' + valuesArray[1] + '~' + valuesArray[2] + '~' + valuesArray[3];
};
CCC.noExponents = function (value) {
    var data = String(value).split(/[eE]/);
    if (data.length == 1)
        return data[0];
    var z = '', sign = value < 0 ? '-' : '', str = data[0].replace('.', ''), mag = Number(data[1]) + 1;
    if (mag < 0) {
        z = sign + '0.';
        while (mag++)
            z += '0';
        return z + str.replace(/^\-/, '');
    }
    mag -= str.length;
    while (mag--)
        z += '0';
    return str + z;
};
CCC.filterNumberFunctionPolyfill = function (value, decimals) {
    var decimalsDenominator = Math.pow(10, decimals);
    var numberWithCorrectDecimals = Math.round(value * decimalsDenominator) / decimalsDenominator;
    var parts = numberWithCorrectDecimals.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
};
CCC.convertValueToDisplay = function (symbol, value, type, fullNumbers) {
    var prefix = '';
    var valueSign = 1;
    value = parseFloat(value);
    var valueAbs = Math.abs(value);
    var decimalsOnBigNumbers = 2;
    var decimalsOnNormalNumbers = 2;
    var decimalsOnSmallNumbers = 4;
    if (fullNumbers === true) {
        decimalsOnBigNumbers = 2;
        decimalsOnNormalNumbers = 0;
        decimalsOnSmallNumbers = 4;
    }
    if (symbol != '') {
        prefix = symbol + ' ';
    }
    if (value < 0) {
        valueSign = -1;
    }
    if (value == 0) {
        return prefix + '0';
    }
    if (value < 0.00001000 && value >= 0.00000100 && decimalsOnSmallNumbers > 3) {
        decimalsOnSmallNumbers = 3;
    }
    if (value < 0.00000100 && value >= 0.00000010 && decimalsOnSmallNumbers > 2) {
        decimalsOnSmallNumbers = 2;
    }
    if (value < 0.00000010 && value >= 0.00000001 && decimalsOnSmallNumbers > 1) {
        decimalsOnSmallNumbers = 1;
    }
    if (type == "short") {
        if (valueAbs > 10000000000) {
            valueAbs = valueAbs / 1000000000;
            return prefix + CCC.filterNumberFunctionPolyfill(valueSign * valueAbs, decimalsOnBigNumbers) + ' B';
        }
        if (valueAbs > 10000000) {
            valueAbs = valueAbs / 1000000;
            return prefix + CCC.filterNumberFunctionPolyfill(valueSign * valueAbs, decimalsOnBigNumbers) + ' M';
        }
        if (valueAbs > 10000) {
            valueAbs = valueAbs / 1000;
            return prefix + CCC.filterNumberFunctionPolyfill(valueSign * valueAbs, decimalsOnBigNumbers) + ' K';
        }
        if (valueAbs >= 1) {
            return prefix + CCC.filterNumberFunctionPolyfill(valueSign * valueAbs, decimalsOnNormalNumbers);
        }
        return prefix + (valueSign * valueAbs).toPrecision(decimalsOnSmallNumbers);
    }
    else {
        if (valueAbs >= 1) {
            return prefix + CCC.filterNumberFunctionPolyfill(valueSign * valueAbs, decimalsOnNormalNumbers);
        }
        return prefix + CCC.noExponents((valueSign * valueAbs).toPrecision(decimalsOnSmallNumbers));
    }
};
//# sourceMappingURL=cryptocompare.utils.js.map

/***/ }),

/***/ 905:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CryptoMoon; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(508);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(507);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_tabs_tabs__ = __webpack_require__(463);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_screen_orientation__ = __webpack_require__(509);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var CryptoMoon = (function () {
    function CryptoMoon(platform, statusBar, splashScreen, screenOrientation) {
        var _this = this;
        this.screenOrientation = screenOrientation;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_tabs_tabs__["a" /* TabsPage */];
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            if (platform.is('cordova')) {
                _this.screenOrientation.lock(_this.screenOrientation.ORIENTATIONS.PORTRAIT);
            }
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
    CryptoMoon = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"/Users/elvis/coding/crypto/src/app/app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"/Users/elvis/coding/crypto/src/app/app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */], __WEBPACK_IMPORTED_MODULE_5__ionic_native_screen_orientation__["a" /* ScreenOrientation */]])
    ], CryptoMoon);
    return CryptoMoon;
}());

//# sourceMappingURL=app.component.js.map

/***/ })

},[510]);
//# sourceMappingURL=main.js.map