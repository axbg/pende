import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthLoginService {
  redirectedFromLogin = false;

  constructor() { }

  redirectingFromLogin() {
    this.redirectedFromLogin = true;
  }

  setRedirectedFromLogin() {
    this.redirectedFromLogin = true;
  }

  getRedirectedFromLogin() {
    return this.redirectedFromLogin;
  }

}
