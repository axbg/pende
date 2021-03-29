import { Component, OnInit } from '@angular/core';
import { SocialAuthService, GoogleLoginProvider } from 'angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { AuthLoginService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private loginURL = environment.BASE_URL + '/api/user/login';

  constructor(private googleAuthService: SocialAuthService, private http: HttpClient,
              private authService: AuthLoginService, private router: Router,
              private spinner: NgxSpinnerService) {
  }

  signInWithGoogle(): void {
    this.spinner.show();
    this.googleAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((result: any) => {
        this.http.post(this.loginURL, { token: result.idToken })
          .subscribe((res: any) => {
            window.localStorage.setItem('token', res.token);
            window.location.reload();
          }, () => {
            this.spinner.hide();
            alert('An error occurred during login');
          });
      }).catch(() => {
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
