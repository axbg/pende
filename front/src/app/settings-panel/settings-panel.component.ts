import { Component, OnInit, Input } from '@angular/core';
import { DoubleData } from 'src/classes/DoubleData';
import { SettingsEditingServiceService } from '../settings-editing-service.service';
import { SettingsConstants } from './constants';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-settings-panel',
  templateUrl: './settings-panel.component.html',
  styleUrls: ['./settings-panel.component.css']
})
export class SettingsPanelComponent implements OnInit {

  themes: DoubleData[];
  cursors: DoubleData[];
  selectedTheme: DoubleData;
  selectedCursor: DoubleData;
  fontSize: number = 24;
  gutter: boolean = true;
  hasWhiteTheme: boolean = false;

  @Input()
  settings: DoubleData[];

  constructor(private settingsService: SettingsEditingServiceService, private layoutService: LayoutService) {
    this.themes = SettingsConstants.getThemes();
    this.cursors = SettingsConstants.getCursors();

    this.layoutService.themeColor$.subscribe(color => {
      this.hasWhiteTheme = color === "white" ? true : false;
    })
  }

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings(){
    this.fontSize = this.settings["fontSize"].getValue();
    this.selectedTheme = this.settings["theme"];
    this.gutter = this.settings["gutter"].getValue();
  }

  transformSliderData(event) {
    let property: String = event.event.target.parentNode.parentNode.getAttribute("property");
    this.handlePropertyChange({ value: new DoubleData(event.value, "", property) });
  }

  transformSwitchData(event) {
    let property: String = event.originalEvent.target.parentNode.parentNode.getAttribute("property");
    this.handlePropertyChange({ value: new DoubleData(event.checked, "", property) });
  }

  handlePropertyChange(event) {
    this.settingsService.modifySettings(event.value);
  }
}
