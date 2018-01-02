import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Storage} from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

}
