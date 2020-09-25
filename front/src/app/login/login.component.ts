import { Component, OnInit } from '@angular/core';
import { AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { AuthLoginService } from '../auth.service';
import { Router } from '@angular/router';
import { Constants } from 'src/classes/Constants';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private loginURL = Constants.BASE_URL + '/api/user/login';

  constructor(private googleAuthService: AuthService, private http: HttpClient,
    private authService: AuthLoginService, private router: Router,
    private spinner: NgxSpinnerService) {
  }

  signInWithGoogle(): void {
    this.spinner.show();
    this.googleAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((result) => {
        this.http.post(this.loginURL, { token: result.idToken })
          .subscribe(res => {
            console.log(res);
            window.localStorage.setItem('token', res['token']);
            window.location.reload();
          }, error => {
            this.spinner.hide();
            alert('An error occurred during login');
          });
      }).catch(err => {
        this.spinner.hide();
        alert('An error occurred during Google authentication');
      });
  }

  ngOnInit() {
    if (window.localStorage.getItem('token')) {
      this.authService.setRedirectedFromLogin();
      this.router.navigateByUrl('/ide');
    }
  }

}
