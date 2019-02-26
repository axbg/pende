import { Component, OnInit } from '@angular/core';
import { DoubleData } from 'src/classes/DoubleData';
import { SettingsEditingServiceService } from '../settings-editing-service.service';

@Component({
  selector: 'app-settings-panel',
  templateUrl: './settings-panel.component.html',
  styleUrls: ['./settings-panel.component.css']
})
export class SettingsPanelComponent implements OnInit {

  themes: DoubleData[] = [];
  selectedProperty: DoubleData;

  constructor(private settingsService: SettingsEditingServiceService) {
    this.themes.push(new DoubleData("eclipse", "Eclipse", "theme"));
    this.themes.push(new DoubleData("dracula", "Dracula", "theme"));
  }

  ngOnInit() {
  }

  handlePropertyChange(event) {
    this.settingsService.modifySettings(this.selectedProperty);
  }

}
