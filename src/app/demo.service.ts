import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DemoService {

  constructor(private http:HttpClient) {}

  // Uses http.get() to load data from a single API endpoint
  getCoinList() {
    return this.http.get('https://min-api.cryptocompare.com/data/all/coinlist');
  }
}
