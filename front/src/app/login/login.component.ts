import { Component, OnInit } from '@angular/core';
import { AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { AuthLoginService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginURL = 'http://localhost:8080/api/user/login';

  constructor(private googleAuthService: AuthService, private http: HttpClient,
    private authService: AuthLoginService, private router: Router) {
  }

  signInWithGoogle(): void {
    this.googleAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((result) => {
        this.http.post(this.loginURL, { token: result.idToken })
          .subscribe(res => {
            window.localStorage.setItem('token', res['token']);
            window.location.reload();
          });
      });
  }

  ngOnInit() {
    if (window.localStorage.getItem('token')) {
      this.authService.setRedirectedFromLogin();
      this.router.navigateByUrl('/ide');
    }
  }

}
