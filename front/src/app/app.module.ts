import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { TabRibbonComponent } from './tab-ribbon/tab-ribbon.component';
import { MenuRibbonComponent } from './menu-ribbon/menu-ribbon.component';

//primeng components import
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
import { TreeModule } from 'ng2-tree'

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
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
