import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  lat: number = 51.678418;
  lng: number = 7.809007;

  constructor(private db: AngularFireDatabase) { }

  ngOnInit() {
    this.db.list('POI').valueChanges().subscribe((e)=>{
      console.log(e);
    })
  }

}
