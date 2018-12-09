import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {MapsAPILoader} from '@agm/core';
import {} from 'googlemaps';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

interface UserResponse {
  login: string;
  bio: string;
  company: string;
}

// struktury do wysyłania
interface CurrentLocation {
  lat: string;
  lng: string;
}

interface User {
  id: string;
}

interface UpdateLocation {
  user: User;
  currentLocation: CurrentLocation;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  serverAPI = 'http://10.24.0.66:8080/';

  private updateLocation: UpdateLocation;

  currentLatitude: number;
  currentLongitude: number;

  @ViewChild('search') public searchElement: ElementRef;

  @ViewChild('gmap') gmapElement: any;

  service: any;

  timeLeft = 6;
  interval;

  constructor(private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private http: HttpClient) {
  }

  ngOnInit() {

    // Ustawienie lokalizacji użytkownika
    this.getUserLocation();

    // Przykład REST API - Get
    const head = new HttpHeaders();
    head.append('Access-Control-Allow-Headers', 'Content-Type');
    head.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    head.append('Access-Control-Allow-Origin', '*');
    this.http.get(this.serverAPI + 'view/disabilities', {headers: head}).subscribe(
      data => {
        console.log(data);
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('Client-side error occured.');
        } else {
          console.log('Server-side error occured.');
        }
      }
    );


    // // Przykładowa implementacja timera, który regularnie łączy się z zewnętrznym API
    // // w naszym przypadku można byłoby tak zrobić update lokalizacji
    // this.interval = setInterval(() => {
    //   if (this.timeLeft > 0) {
    //     this.http.get<UserResponse>('https://api.github.com/users/seeschweiler').subscribe(
    //       data => {
    //         console.log('User Login: ' + data.login);
    //         console.log('Bio: ' + data.bio);
    //         console.log('Company: ' + data.company);
    //       },
    //       (err: HttpErrorResponse) => {
    //         if (err.error instanceof Error) {
    //           console.log('Client-side error occured.');
    //         } else {
    //           console.log('Server-side error occured.');
    //         }
    //       }
    //     );
    //     this.timeLeft--;
    //   } else {
    //     this.timeLeft = 60;
    //   }
    // }, 5000)


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
      radius: 1400,
      type: 'restaurant'
    }, this.callback);
  }

  public sendUpdatePost() {
    // Przykład REST API - Post
    this.updateLocation = {user: {
        id: 'UserId123'
      },
      currentLocation: {
        lat: this.currentLatitude.toString(),
        lng: this.currentLongitude.toString()
      }
    };

    const head = new HttpHeaders();
    head.append('Access-Control-Allow-Headers', 'Content-Type');
    head.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    head.append('Access-Control-Allow-Origin', '*');
    const req = this.http.post(this.serverAPI + 'update/location', this.updateLocation, {headers: head})
      .subscribe(
        res => {
          console.log(res);
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log('Client-side error occured.');
          } else {
            console.log('Server-side error occured.');
          }
        }
      );
  }

  public getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.currentLatitude = position.coords.latitude;
        this.currentLongitude = position.coords.longitude;
        console.log('Current location: lat - ' + this.currentLatitude + ' & lng - ' + this.currentLongitude);
        this.sendUpdatePost();
      });
    }
  }

}
