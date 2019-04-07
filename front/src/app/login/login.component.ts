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

  constructor(private googleAuthService: AuthService, private http: HttpClient,
    private authService: AuthLoginService, private router: Router) { }

  signInWithGoogle(): void {
    this.googleAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((result) => {
        //make http request sending the user here
        console.log(result);
        this.authService.setRedirectedFromLogin();
        this.router.navigateByUrl("/ide");
      });
  }

  ngOnInit() {
  }

}
