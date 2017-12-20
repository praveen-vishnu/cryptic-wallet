import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {DemoService} from "../../app/demo.service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  public foods;

  constructor(public navCtrl: NavController,
              private _demoService: DemoService) {

  }

  ngOnInit(): void {
    this.getFoods();
  }

  getFoods() {
    this._demoService.getFoods().subscribe(
      data => {
        this.foods = data;
        console.log(this.foods);
      },
      err => console.error(err),
      () => console.log('done loading foods')
    );
  }

}
