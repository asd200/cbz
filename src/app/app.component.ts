import {Component, OnInit} from '@angular/core';
import {SwUpdate} from "@angular/service-worker";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'cbz-navigation';

  constructor(
    private swUpdate: SwUpdate
  ) {}

  public ngOnInit() {
    this.swUpdate.available.subscribe(() => {
      window.location.reload();
    });
  }
}
