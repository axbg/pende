import { Component, Input } from '@angular/core';
import { SettingData } from 'src/app/classes/SettingData';
import { LayoutService } from 'src/app/services/layout.service';
import { SettingService } from 'src/app/services/setting-service';
import { SettingsConstants } from './settings-constants';

@Component({
  selector: 'app-settings-panel',
  templateUrl: './settings-panel.component.html',
  styleUrls: ['./settings-panel.component.css'],
})
export class SettingsPanelComponent {
  themes: SettingData[];
  cursors: SettingData[];
  selectedTheme: SettingData;
  selectedCursor: SettingData;
  fontSize = 24;
  gutter = true;
  settings: Object = {};

  @Input()
  themeColor: String;

  constructor(
    private settingsEditingService: SettingService, private layoutService: LayoutService
  ) {
    this.themes = SettingsConstants.getThemes();
    this.cursors = SettingsConstants.getCursors();

    settingsEditingService.loadSettingsObservable$.subscribe(data => {
      this.settings = data;
      this.loadSelectedSettings();
    });
  }

  loadSelectedSettings() {
    if (this.settings) {
      this.fontSize = this.settings['fontSize'].getValue();
      this.gutter = this.settings['gutter'].getValue();
      this.selectedTheme = this.settings['theme'];
      this.selectedCursor = this.settings['cursor'];
    }
  }

  transformSliderData(event) {
    const property: String = event.event.target.parentNode.parentNode.getAttribute(
      'property'
    );
    this.handlePropertyChange({
      value: new SettingData(event.value, '', property),
    });
  }

  transformSwitchData(event) {
    const property: String = event.originalEvent.target.parentNode.parentNode.getAttribute(
      'property'
    );
    this.handlePropertyChange({
      value: new SettingData(event.checked, '', property),
    });
  }

  handlePropertyChange(event) {
    (<HTMLElement>document.querySelector('.ui-button')).style.backgroundColor =
      '#B71C1C';
    this.layoutService.changeSettings(event.value);
    Object.assign(this.settings, { ...this.settings, [event.value.property]: event.value });
  }

  saveSettings() {
    (<HTMLElement>document.querySelector('.ui-button')).style.backgroundColor =
      '#007AD9';
    this.settingsEditingService.saveSettings(this.settings);
  }
}
