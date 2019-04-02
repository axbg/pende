import { Component, OnInit, TemplateRef, ContentChild, Input } from '@angular/core';
import { TabEditingServiceService } from '../tab-editing-service.service';
import { DoubleData } from 'src/classes/DoubleData';
import { SettingsEditingServiceService } from '../settings-editing-service.service';

@Component({
  selector: 'app-panel-holder',
  templateUrl: './panel-holder.component.html',
  styleUrls: ['./panel-holder.component.css']
})
export class PanelHolderComponent implements OnInit {

  @Input() panel: String;
  settings: Object = {};

  files: [];


  //va reprezenta sursa de adevar pentru toate panel-urile copil
  //cand un copil va modifica ceva, va apela un serviciu ce va reflecta schimbarile aici, 
  //urmand ca de aici sa fie trimise in back
  //datele sunt incarcate la load si trimise catre copii in momentul in care acestia fac render

  //aici se va instantia si websocket-ul
  constructor(private tabEditingService: TabEditingServiceService,
    private settingsEditingService: SettingsEditingServiceService) {

    this.tabEditingService.menuPanel$.subscribe(payload => {
      this.panel = payload;
    })

    this.settingsEditingService.modifiedSettings$.subscribe(payload => {
      let property: any = payload["property"];
      Object.assign(this.settings, { ...this.settings, [property]: payload })
      this.saveSettings();
    })

    this.initWS();
    this.loadData();

  }

  ngOnInit() {
  }

  initWS() {
    //init ws here
  }

  loadData() {
    //retrieving data from back-end using websocket connection
    let loadedSettings = {
      "fontSize": new DoubleData(26, "Font-Size", "fontSize"),
      "theme": new DoubleData("eclipse", "Theme", "theme"),
      "gutter": new DoubleData(true, "Gutter", "gutter")
    };

    Object.keys(loadedSettings).forEach(element => {
      Object.assign(this.settings, { ...this.settings, [element]: loadedSettings[element] });
    })

    this.loadSettings();
  }

  loadSettings() {
    setTimeout(() => {
      Object.keys(this.settings).forEach(setting => {
        this.settingsEditingService.modifySettings(this.settings[setting]);
      })
    }, 50);
  }

  saveSettings() {
    //will send the settings to back-end via websocket connection
  }

}
