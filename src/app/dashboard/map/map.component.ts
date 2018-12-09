import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {FormBuilder, FormGroup} from "@angular/forms";
import {animate, style, transition, trigger} from "@angular/animations";
import {map} from "rxjs/operators";
import {Observable, Subscription} from "rxjs";

export interface DisabilityFlags {
  type1: boolean,
  type2: boolean,
  type3: boolean
}


export interface Coordinations {
  lat: Number;
  lng: Number;
}

export interface Address {
  street: string;
  lng: string;
}

export const Disabilities = {
  WHEELCHAIR: 'wheelchair',
  DEAF: 'deaf'
}

export interface Poi {
  key: string,
  id: string,
  disabilityAccess: [],
  name: string,
  location: Coordinations,
  address: Address,
  email: string,
  phone: string,
  disabilityFlags: DisabilityFlags[],
  disabilityRating: [],
  caretakerId: string,

}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  animations: [
    trigger('animationOption2', [
      transition(':enter', [
        style({ height: '0' }),
        animate(300)
      ]),
      transition(':leave', [
        animate(300, style({ height: 0 }))
      ]),
    ])
  ]
})

export class MapComponent implements OnInit {

  currentLocation: Coordinations;
  destination: Coordinations;
  currentMapViewLatitude: Number;
  currentMapViewLongitude: Number;
  markerIsClicked: boolean = false;
  listOfPois: Poi;
  wrapperMarkerInfo: Poi;

  form: FormGroup;
  poiList$: Observable<{}>;

  @ViewChild('agmMap') agmMapElement: ElementRef;

  constructor(
    private db: AngularFireDatabase, private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.getUserLocation();
    this.poiList$  = this.db.list(`/poi_fullinfo`).snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const key = action.payload.key;
          const data = { key, ...action.payload.val() };
          return data;
        });
      })
    )
  }

  updatePoi(poi: Poi): void {
    this.db.object('/poi_fullinfo/' + poi.key).update(poi);
  }

  public getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {

        this.currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        this.currentMapViewLatitude = position.coords.latitude;
        this.currentMapViewLongitude = position.coords.longitude;
      });
    }
  }

  public addPoiToDatabase(coords) {
    const poi = {
      uniqueId: 'SADasd',
      name: 'SsadAD',
      location: coords,
      email: 'email@gmail.pl',
      phone: '748 828 273',
      disabilityAccess: [{
        name: 'wheelchair',
        checked: true,
      }, {
        name: 'deaf',
        checked: true,
      }],
    };

    this.db.list('poi_fullinfo').push(poi);
  }

  public markerClicked(poi: any) {
    this.markerIsClicked = true;
    this.currentMapViewLatitude = poi.location.coords.lat;
    this.currentMapViewLongitude = poi.location.coords.lng;

    this.wrapperMarkerInfo = poi;
  }

  public getRoute(poi): void {
    this.destination = {
      lat: poi.location.coords.lat,
      lng: poi.location.coords.lng,
    }
  }

  public mapBoundsChanged(event) {
    // console.log(event)
  }

  public mapClick(event) {
    setTimeout(() => {
      // @ts-ignore
      console.log(this.agmMapElement._elem.nativeElement.querySelector('.poi-info-window .title').innerHTML);
    });
    // this.agmMapElement.nativeElement.querySelector('.asd');

    // console.log(event);
    //store the original setContent-function
    // var fx = google.maps.InfoWindow.prototype.setContent;
    //
    // //override the built-in setContent-method
    // google.maps.InfoWindow.prototype.setContent = function (content) {
    //   //when argument is a node
    //   if (content.querySelector) {
    //     //search for the address
    //     var addr = content.querySelector('.gm-basicinfo .gm-addr');
    //     if (addr) {
    //
    //       alert(addr.textContent);
    //       //leave the function here
    //       //when you don't want the InfoWindow to appear
    //
    //     }
    //   }
    //   //run the original setContent-method
    //   fx.apply(this, arguments);
    // };
  }

}
