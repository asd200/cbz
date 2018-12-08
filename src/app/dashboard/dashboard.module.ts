import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MapComponent} from './map/map.component';
import {MapService} from "./map/map.service";
import {AgmCoreModule} from "@agm/core";
import {AngularFireDatabase} from "@angular/fire/database-deprecated";
import {AngularFireDatabaseModule} from "@angular/fire/database";
import {AngularFireModule} from "@angular/fire";
import {environment} from "../../environments/environment";

@NgModule({
  declarations: [
    MapComponent
  ],
  imports: [
    CommonModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCEjhE_UCQE-lGbuwipRCJHqCqB4RH5eDI',
      libraries: ['places']
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
  ],
  providers: [MapService]
})
export class DashboardModule {
}
