import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {GeoService} from './geo.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  currentLatitude: number;
  currentLongitude: number;

  markers: any;
  subscription: any;

  constructor(private db: AngularFireDatabase, private geo: GeoService) {
    this.seedDatabase();
  }

  ngOnInit() {
    this.db.list('POI').valueChanges().subscribe((e) => {
      console.log(e);
    });
    this.getUserLocation();
    this.subscription = this.geo.hits
      .subscribe(hits => this.markers = hits);
  }

  private seedDatabase() {
    let dummyPoints = [
      [52.9, 21.1],
      [52.7, 21.2],
      [52.1, 21.3],
      [52.3, 21.0],
      [52.7, 21.1]
    ];

    dummyPoints.forEach((val, idx) => {
      let name = `dummy-location-${idx}`;
      console.log(idx);
      this.geo.setLocation(name, val);
    });
  }

  public getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.currentLatitude = position.coords.latitude;
        this.currentLongitude = position.coords.longitude;
        console.log('Current location: lat - ' + this.currentLatitude + ' & lng - ' + this.currentLongitude);

        this.geo.getLocations(50, [this.currentLatitude, this.currentLongitude]);
      });
    }
  }

}
