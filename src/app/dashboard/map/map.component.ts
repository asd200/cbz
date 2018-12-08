import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  currentLatitude: number;
  currentLongitude: number;

  constructor(private db: AngularFireDatabase) { }

  ngOnInit() {
    this.db.list('POI').valueChanges().subscribe((e) => {
      console.log(e);
    });
    this.getUserLocation();
  }

  public getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.currentLatitude = position.coords.latitude;
        this.currentLongitude = position.coords.longitude;
      });
    }
  }

}
