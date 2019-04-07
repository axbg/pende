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

  loginURL = "http://localhost:8000/api/user/login";

  constructor(private googleAuthService: AuthService, private http: HttpClient,
    private authService: AuthLoginService, private router: Router) { 
    }

  signInWithGoogle(): void {
    this.googleAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((result) => {
        this.http.post(this.loginURL, {token: result.idToken})
        .subscribe(result => {
          window.localStorage.setItem("token", result["token"]);
          this.authService.setRedirectedFromLogin();
          this.router.navigateByUrl("/ide");
        })
      });
  }

  ngOnInit() {
  }

}
