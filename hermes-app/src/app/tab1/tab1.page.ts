import { Component } from '@angular/core';
import { HubService } from '../services/hub.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  constructor(private readonly hubService: HubService) {}
}
