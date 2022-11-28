import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { bindCallback, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HubService implements OnInit, OnDestroy {
  private socket: Socket;
  private onEvent: (name: string) => Observable<any[]>;

  constructor() {
    this.socket = io(`ws://${environment.host}:${environment.port}`);

    this.socket.connect();
  }
  ngOnInit(): void {
    this.onEvent = bindCallback(this.socket.on);
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }

  public onMessage() {
    return this.onEvent('message');
  }
}
