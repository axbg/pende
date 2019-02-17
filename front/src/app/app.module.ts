import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { TabRibbonComponent } from './tab-ribbon/tab-ribbon.component';

//primeng components import
import { TabViewModule } from 'primeng/tabview';
import { ControlTabComponent } from './control-tab/control-tab.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    TabRibbonComponent,
    ControlTabComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TabViewModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
