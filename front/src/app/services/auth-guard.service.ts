import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthLoginService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private auth: AuthLoginService) { }

  canActivate(): boolean {
    if (!this.auth.getRedirectedFromLogin()) {
      this.router.navigateByUrl('/');
      return false;
    }

    return true;
  }
}
