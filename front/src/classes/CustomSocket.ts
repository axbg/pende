import { Injectable } from "@angular/core";
import { Socket } from 'ngx-socket-io';
import { Constants } from './Constants';

@Injectable()
export class CustomSocket extends Socket {

    url: string = "http://localhost:8000";

    constructor(){
        super({url: Constants.BASE_URL, options: {query: {token: "something"}}});
    }
}