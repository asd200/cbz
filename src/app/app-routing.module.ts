import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MapComponent} from "./dashboard/map/map.component";
import {AuthenticationComponent} from "./authentication/authentication.component";

const routes: Routes = [
  { path: '', component: AuthenticationComponent },
  { path: 'map', component: MapComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
