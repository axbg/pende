import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TerminalService {
    private sendCommandSubject = new Subject<string>();
    private sendReponseSubject = new Subject<string>();

    sendCommandObservable$ = this.sendCommandSubject.asObservable();
    sendResponseObservable$ = this.sendReponseSubject.asObservable();

    sendCommand(command: string) {
        if (command) {
            this.sendCommandSubject.next(command);
        }
    }

    sendResponse(response: string) {
        if (response) {
            this.sendReponseSubject.next(response);
        }
    }
}
