import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {FormBuilder, FormGroup} from "@angular/forms";
import {animate, style, transition, trigger} from "@angular/animations";
import {filter, map} from "rxjs/operators";
import {Observable} from "rxjs";
import {MapsAPILoader} from '@agm/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {} from 'googlemaps';
import {forEach} from "@angular/router/src/utils/collection";
import {log} from "util";
import {bind} from "@angular/core/src/render3";

interface UserResponse {
  login: string;
  bio: string;
  company: string;
}

export interface DisabilityFlags {
  type1: boolean,
  type2: boolean,
  type3: boolean
}


export interface Coordinations {
  lat: number;
  lng: number;
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
        style({height: '0'}),
        animate(300)
      ]),
      transition(':leave', [
        animate(300, style({height: 0}))
      ]),
    ])
  ]
})

export class MapComponent implements OnInit {

  currentLocation: Coordinations;
  destination: Coordinations;
  currentMapViewLatitude: number;
  currentMapViewLongitude: number;
  markerIsClicked: boolean = false;
  wrapperMarkerInfo: Poi;

  form: FormGroup;
  poiList$: Observable<{}>;
  poiPlacesList: any = [];

  @ViewChild('agmMap') agmMapElement: ElementRef;
  @ViewChild('search') public searchElement: ElementRef;
  @ViewChild('gmap') gmapElement: any;

  timeLeft: number = 6;
  interval;

  constructor(
    private db: AngularFireDatabase, private formBuilder: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.getUserLocation();
    this.poiList$ = this.db.list(`/poi_fullinfo`).snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const key = action.payload.key;
          const data = {key, ...action.payload.val()};
          return data;
        });
      })
    );

    // Tutaj jest przykładowa implementacja podpowiedzi wyszukiwania
    // this.mapsAPILoader.load().then(() => {
    //   const autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {types: ['address']});
    //   autocomplete.addListener('place_changed', () => {
    //     this.ngZone.run(() => {
    //       const place: any = autocomplete.getPlace();
    //
    //       if (place.geometry === undefined || place.geometry === null) {
    //         return;
    //       }
    //     });
    //   });
    // });

  }

  updatePoi(poi: Poi): void {
    this.db.object('/poi_fullinfo/' + poi.key).update(poi);
  }


//   // Odpowiedz na zapytanie 'Nearby search'
//   public callback(results, status) {
// console.log(this.poiPlaces)
//     if (status === google.maps.places.PlacesServiceStatus.OK) {
//       const poiPlacesList: any = {};
//       for (let i = 0; i < results.length; i++) {
//         const lat = results[i].geometry.location.lat().toString();
//         const lng = results[i].geometry.location.lng().toString();
//         // this.poiPlacesList.push({ lat: lat, lng: lng });
//         this.poiPlacesList[i] ={lat: lat, lng: lng}
//       }
//       console.log(poiPlacesList)
//     }
//   }

  // Tutaj jest przykładowa implementacja wyszukiwania sklepów w okolicy
  public onClickPlace(type) {
    this.poiPlacesList = []
    const myMap = new google.maps.places.PlacesService(this.gmapElement.nativeElement);
    myMap.nearbySearch({
      location: new google.maps.LatLng(this.currentLocation.lat, this.currentLocation.lng),
      radius: 2000,
      type: type
    }, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < results.length; i++) {
          const lat = results[i].geometry.location.lat().toString();
          const lng = results[i].geometry.location.lng().toString();
          // this.poiPlacesList.push({ lat: lat, lng: lng });
          this.poiPlacesList[i] = {lat: lat, lng: lng}
        }
        console.log(this.poiPlacesList)
      }
    });
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
      }, {
        name: 'sign_language',
        checked: true,
      }, {
        name: 'blind',
        checked: true,
      }, {
        name: 'parking',
        checked: true,
      }, {
        name: 'wc',
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
    // setTimeout(() => {
    //   // @ts-ignore
    //   console.log(this.agmMapElement._elem.nativeElement.querySelector('.poi-info-window .title').innerHTML);
    // });
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
