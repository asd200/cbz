import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {log} from "util";
import {map} from "rxjs/operators";
import {Subscription} from "rxjs";


export interface Poi {
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  lat: number = 51.678418;
  lng: number = 7.809007;

  listOfPois: Poi;

  constructor(private db: AngularFireDatabase) {
  }

  ngOnInit() {
    this.getUserLocation();
    this.getAllPoiFromDatabase();
  }

  public getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    }
  }

  public getAllPoiFromDatabase() {
    this.db.list('poi').valueChanges().subscribe((e: any) => {
      this.listOfPois = e;
      console.log(this.listOfPois)
    });
  }

  public setPoi(event) {
    this.db.list('poi').push(event.coords).then(() => {
      console.log('success')
    });
  }
}
