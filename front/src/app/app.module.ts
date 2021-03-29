import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FormsModule } from '@angular/forms';

import { TabViewModule } from 'primeng/tabview';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { AceEditorModule } from 'ng2-ace-editor';
import { TreeModule } from 'ng2-tree';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider } from 'angularx-social-login';

import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout/layout.component';
import { TabRibbonComponent } from './components/tab-ribbon/tab-ribbon.component';
import { MenuRibbonComponent } from './components/menu-ribbon/menu-ribbon.component';
import { AceEditorComponent } from './components/ace-editor/ace-editor.component';
import { PanelHolderComponent } from './components/panel-holder/panel-holder.component';
import { SettingsPanelComponent } from './components/settings-panel/settings-panel.component';
import { ExecutionPanelComponent } from './components/execution-panel/execution-panel.component';
import { TerminalComponent } from './components/terminal/terminal.component';
import { PrimeTerminalComponent } from './components/prime-terminal/prime-terminal.component';
import { FilesPanelComponent } from './components/files-panel/files-panel.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuardService } from './services/auth-guard.service';

import { environment } from '../environments/environment';

const config: SocketIoConfig = {
  url: environment.BASE_URL, options: {
    query: {
      token:
        window.localStorage.getItem('token')
    }
  }
};

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'ide', component: LayoutComponent, canActivate: [AuthGuardService] }
];

const googleLoginOptions = {
  scope: 'profile email'
};

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    TabRibbonComponent,
    MenuRibbonComponent,
    AceEditorComponent,
    PanelHolderComponent,
    SettingsPanelComponent,
    ExecutionPanelComponent,
    TerminalComponent,
    PrimeTerminalComponent,
    FilesPanelComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TabViewModule,
    MenubarModule,
    InputTextModule,
    AceEditorModule,
    DropdownModule,
    FormsModule,
    SliderModule,
    InputSwitchModule,
    TooltipModule,
    TreeModule,
    HttpClientModule,
    ButtonModule,
    DialogModule,
    NgxSpinnerModule,
    SocketIoModule.forRoot(config),
    RouterModule.forRoot(routes),
    SocialLoginModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.GOOGLE_CLIENT_ID, googleLoginOptions)
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
