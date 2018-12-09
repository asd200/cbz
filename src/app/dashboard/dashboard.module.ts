import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MapComponent} from './map/map.component';
import {MapService} from "./map/map.service";
import {AgmCoreModule} from "@agm/core";
import {AngularFireDatabaseModule} from "@angular/fire/database";
import {AngularFireModule} from "@angular/fire";
import {environment} from "../../environments/environment";
import { HttpClientModule } from '@angular/common/http';
import {AgmSnazzyInfoWindowModule} from "@agm/snazzy-info-window";
import {AgmDirectionModule} from "agm-direction";
import {MatButtonModule, MatCheckboxModule} from "@angular/material";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    HttpClientModule,
    AgmSnazzyInfoWindowModule,
    AgmDirectionModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [MapService]
})
export class DashboardModule {
}
