import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthLoginService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private auth: AuthLoginService) {

  }

  canActivate(): boolean {
    console.log(this.auth.getRedirectedFromLogin());
    if (!this.auth.getRedirectedFromLogin()) {
      console.log("here");
      this.router.navigateByUrl("/");
      return false;
    }

    return true;
  }
}
