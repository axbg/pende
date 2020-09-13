import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { TabRibbonComponent } from './tab-ribbon/tab-ribbon.component';
import { MenuRibbonComponent } from './menu-ribbon/menu-ribbon.component';

// primeng components import
import { TabViewModule } from 'primeng/tabview';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';

import { AceEditorModule } from 'ng2-ace-editor';
import { AceEditorComponent } from './ace-editor/ace-editor.component';
import { PanelHolderComponent } from './panel-holder/panel-holder.component';
import { SettingsPanelComponent } from './settings-panel/settings-panel.component';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { ExecutionPanelComponent } from './execution-panel/execution-panel.component';
import { TerminalComponent } from './terminal/terminal.component';
import { PrimeTerminalComponent } from './prime-terminal/prime-terminal.component';
import { FilesPanelComponent } from './files-panel/files-panel.component';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TreeModule } from 'ng2-tree';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './auth-guard.service';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, LoginOpt } from 'angularx-social-login';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

const config: SocketIoConfig = {
  url: 'http://localhost:8080', options: {
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

const googleLoginOptions: LoginOpt = {
  scope: 'profile email'
};

export function provideConfig() {
  const provConfig = new AuthServiceConfig([
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider('399387437152-jevvfiorm3oc8hqkh7d60eninldiqpe6.apps.googleusercontent.com',
        googleLoginOptions)
    }
  ]);

  return provConfig;
}

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
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
