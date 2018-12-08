import {Injectable} from '@angular/core';


import {GeoFire} from 'geofire';
import {BehaviorSubject} from 'rxjs';
import {AngularFireDatabase} from '@angular/fire/database';

@Injectable()
export class GeoService {

  dbRef: any;
  geoFire: any;

  hits = new BehaviorSubject([]);

  constructor(private db: AngularFireDatabase) {
    /// Reference database location for GeoFire
    this.dbRef = this.db.list('/locations');
    this.geoFire = new GeoFire(this.dbRef.query.ref);
  }

  /// Adds GeoFire data to database
  setLocation(key: string, coords: Array<number>) {
    this.geoFire.set(key, coords)
      .then(_ => console.log('location updated'))
      .catch(err => console.log(err));
  }


  /// Queries database for nearby locations
  /// Maps results to the hits BehaviorSubject
  getLocations(radius: number, coords: Array<number>) {
    this.geoFire.query({
      center: coords,
      radius: radius
    })
      .on('key_entered', (key, location, distance) => {
        let hit = {
          key: key,
          location: location,
          distance: distance
        };

        let currentHits = this.hits.value;
        currentHits.push(hit);
        this.hits.next(currentHits);
      });


  }

}
