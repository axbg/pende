import { Component, OnInit } from '@angular/core';
import { DoubleData } from 'src/classes/DoubleData';
import { SettingsEditingServiceService } from '../settings-editing-service.service';
import { SettingsConstants } from './constants';

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

  constructor(private settingsService: SettingsEditingServiceService) {
    this.themes = SettingsConstants.getThemes();
    this.cursors = SettingsConstants.getCursors();

  }

  ngOnInit() {
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

  saveSettings(){
    console.log('here will be an api call');
  }

}
