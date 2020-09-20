import { Component, OnInit, Input } from "@angular/core";
import { DoubleData } from "src/classes/DoubleData";
import { SettingsEditingServiceService } from "../settings-editing-service.service";
import { SettingsConstants } from "./constants";

@Component({
  selector: "app-settings-panel",
  templateUrl: "./settings-panel.component.html",
  styleUrls: ["./settings-panel.component.css"],
})
export class SettingsPanelComponent implements OnInit {
  themes: DoubleData[];
  cursors: DoubleData[];
  selectedTheme: DoubleData;
  selectedCursor: DoubleData;
  fontSize = 24;
  gutter = true;

  @Input()
  themeColor: String;

  @Input()
  settings: DoubleData[];

  constructor(
    private settingsService: SettingsEditingServiceService,
  ) {
    this.themes = SettingsConstants.getThemes();
    this.cursors = SettingsConstants.getCursors();
  }

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    this.fontSize = this.settings["fontSize"].getValue();
    this.gutter = this.settings["gutter"].getValue();
    this.selectedTheme = this.settings["theme"];
    this.selectedCursor = this.settings["cursor"];
  }

  transformSliderData(event) {
    const property: String = event.event.target.parentNode.parentNode.getAttribute(
      "property"
    );
    this.handlePropertyChange({
      value: new DoubleData(event.value, "", property),
    });
  }

  transformSwitchData(event) {
    const property: String = event.originalEvent.target.parentNode.parentNode.getAttribute(
      "property"
    );
    this.handlePropertyChange({
      value: new DoubleData(event.checked, "", property),
    });
  }

  handlePropertyChange(event) {
    (<HTMLElement>document.querySelector(".ui-button")).style.backgroundColor =
      "#B71C1C";
    this.settingsService.modifySettings(event.value);
  }

  saveSettings() {
    (<HTMLElement>document.querySelector(".ui-button")).style.backgroundColor =
      "#007AD9";
    this.settingsService.saveCurrentSettings();
  }
}
