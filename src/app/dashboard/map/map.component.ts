import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {MapsAPILoader} from '@agm/core';
import {} from 'googlemaps';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

interface UserResponse {
  login: string;
  bio: string;
  company: string;
}


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  currentLatitude: number;
  currentLongitude: number;

  @ViewChild('search') public searchElement: ElementRef;

  @ViewChild('gmap') gmapElement: any;

  service: any;

  constructor(private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private http: HttpClient) {
  }

  ngOnInit() {

    // Przykład REST API - Get
    this.http.get<UserResponse>('https://api.github.com/users/seeschweiler').subscribe(
      data => {
        console.log('User Login: ' + data.login);
        console.log('Bio: ' + data.bio);
        console.log('Company: ' + data.company);
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('Client-side error occured.');
        } else {
          console.log('Server-side error occured.');
        }
      }
    );

    // Przykład REST API - Post
    const req = this.http.post('http://jsonplaceholder.typicode.com/posts', {
      title: 'foo',
      body: 'bar',
      userId: 1
    })
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log('Error occured');
        }
      );


    // Tutaj jest przykładowa implementacja podpowiedzi wyszukiwania
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {types: ['address']});
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: any = autocomplete.getPlace();

          console.log(place);

          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
        });
      });
    });

    // Ustawienie lokalizacji użytkownika
    this.getUserLocation();
  }


  // Odpowiedz na zapytanie 'Nearby search'
  private callback(results, status) {
    console.log('Status ' + status);
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      console.log(results);
      for (let i = 0; i < results.length; i++) {
        console.log(results[i]);
        console.log('Lat: ' + results[i].geometry.location.lat());
        console.log('Lng: ' + results[i].geometry.location.lng());
      }
    }
  }

  // Tutaj jest przykładowa implementacja wyszukiwania sklepów w okolicy
  public onClickStores(event) {
    const myMap = new google.maps.places.PlacesService(this.gmapElement.nativeElement);
    myMap.nearbySearch({
      location: new google.maps.LatLng(this.currentLatitude, this.currentLongitude),
      radius: 400,
      type: 'store'
    }, this.callback);
  }

  // Tutaj jest przykładowa implementacja wyszukiwania restauracji w okolicy
  public onClickRestaurants(event) {
    const myMap = new google.maps.places.PlacesService(this.gmapElement.nativeElement);
    myMap.nearbySearch({
      location: new google.maps.LatLng(this.currentLatitude, this.currentLongitude),
      radius: 400,
      type: 'restaurant'
    }, this.callback);
  }

  public getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.currentLatitude = position.coords.latitude;
        this.currentLongitude = position.coords.longitude;
        console.log('Current location: lat - ' + this.currentLatitude + ' & lng - ' + this.currentLongitude);
      });
    }
  }

}
