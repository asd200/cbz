import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MapComponent} from './map/map.component';
import {MapService} from "./map/map.service";
import {AgmCoreModule} from "@agm/core";

@NgModule({
  declarations: [
    MapComponent
  ],
  imports: [
    CommonModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCEjhE_UCQE-lGbuwipRCJHqCqB4RH5eDI'
    })
  ],
  providers: [MapService]
})
export class DashboardModule {
}
