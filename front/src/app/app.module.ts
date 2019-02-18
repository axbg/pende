import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { TabRibbonComponent } from './tab-ribbon/tab-ribbon.component';
import { ControlTabComponent } from './control-tab/control-tab.component';
import { MenuRibbonComponent } from './menu-ribbon/menu-ribbon.component';

//primeng components import
import { TabViewModule } from 'primeng/tabview';
import { MenubarModule } from 'primeng/menubar';
import {InputTextModule} from 'primeng/inputtext';

import { AceEditorModule } from 'ng2-ace-editor';
import { AceEditorComponent } from './ace-editor/ace-editor.component';


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    TabRibbonComponent,
    ControlTabComponent,
    MenuRibbonComponent,
    AceEditorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TabViewModule,
    MenubarModule,
    InputTextModule,
    AceEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
