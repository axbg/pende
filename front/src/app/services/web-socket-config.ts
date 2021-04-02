import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from '../../environments/environment';

@Injectable()
export class SocketOne extends Socket {
    constructor() {
        super({
            url: environment.BASE_URL,
            options: {
                query: {
                    token: window.localStorage.getItem('token')
                }
            }
        })
    };
}