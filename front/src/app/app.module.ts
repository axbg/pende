import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout/layout.component';
import { TabRibbonComponent } from './components/tab-ribbon/tab-ribbon.component';
import { MenuRibbonComponent } from './components/menu-ribbon/menu-ribbon.component';

import { TabViewModule } from 'primeng/tabview';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';

import { AceEditorModule } from 'ng2-ace-editor';
import { AceEditorComponent } from './components/ace-editor/ace-editor.component';
import { PanelHolderComponent } from './components/panel-holder/panel-holder.component';
import { SettingsPanelComponent } from './components/settings-panel/settings-panel.component';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { ExecutionPanelComponent } from './components/execution-panel/execution-panel.component';
import { TerminalComponent } from './components/terminal/terminal.component';
import { PrimeTerminalComponent } from './components/prime-terminal/prime-terminal.component';
import { FilesPanelComponent } from './components/files-panel/files-panel.component';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TreeModule } from 'ng2-tree';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SocketIoModule } from 'ngx-socket-io';
import { LoginComponent } from './components/login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, LoginOpt } from 'angularx-social-login';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SocketOne } from './services/web-socket-config';

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
      provider: new GoogleLoginProvider(environment.GOOGLE_CLIENT_ID, googleLoginOptions)
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
    SocketIoModule,
    RouterModule.forRoot(routes),
    SocialLoginModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    SocketOne,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
