import { Component, OnInit, TemplateRef, ContentChild, Input } from '@angular/core';
import { TabEditingServiceService } from '../tab-editing-service.service';
import { DoubleData } from 'src/classes/DoubleData';
import { SettingsEditingServiceService } from '../settings-editing-service.service';
import { NavigationTab } from 'src/classes/NavigationTab';
import { FilesEditingService } from '../files-editing.service';
import { LayoutService } from '../layout.service';
import { Constants } from 'src/classes/Constants';
import { ExecutionService } from '../execution.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-panel-holder',
  templateUrl: './panel-holder.component.html',
  styleUrls: ['./panel-holder.component.css']
})
export class PanelHolderComponent implements OnInit {

  @Input() panel: String;

  settings: Object = {};
  files: any;
  hasWhiteTheme: boolean;


  //va reprezenta sursa de adevar pentru toate panel-urile copil
  //cand un copil va modifica ceva, va apela un serviciu ce va reflecta schimbarile aici, 
  //urmand ca de aici sa fie trimise in back
  //datele sunt incarcate la load si trimise catre copii in momentul in care acestia fac render

  //aici se va instantia si websocket-ul
  constructor(private tabEditingService: TabEditingServiceService,
    private settingsEditingService: SettingsEditingServiceService,
    private filesEditingService: FilesEditingService,
    private executionService: ExecutionService,
    private layoutService: LayoutService,
    private socket: Socket) {

    this.tabEditingService.menuPanel$.subscribe(payload => {
      this.panel = payload;
    })

    this.settingsEditingService.modifiedSettings$.subscribe(payload => {
      let property: any = payload["property"];
      Object.assign(this.settings, { ...this.settings, [property]: payload })
      this.saveSettings();
    })

    this.tabEditingService.getFileSource$.subscribe(file => {
      //call websocket event

      //content will be populated on a websocket event
      //so everything down there will have to be moved in the callback 
      let content = "asd";
      let navTab = new NavigationTab(file["id"], file["title"], content, file["path"], 0);
      this.tabEditingService.openNewTab(navTab);
    })

    this.filesEditingService.actionFired$.subscribe(action => {
      switch (action["type"]) {
        case "create":
          console.log("creating");

          //fire event for create
          //after the event is created, update the id in the filesPanel using the following service
          this.filesEditingService.fireUpdateFileId({
            newId: 250, oldId: action["oldId"],
            value: action["value"], path: action["path"], parentId: action['parentId'],
            isDirectory: action["isDirectory"]
          });
          break;
        case "delete":
          //fire event for delete
          console.log("deleting " + action["node"]["value"]);
          break;
        case "rename":
          //fire event for rename
          console.log("renaming " + action["node"]["value"]);
          break;
        case "moving":
          break;
      }
    })

    this.filesEditingService.updateStoreFired$.subscribe(files => {
      this.files = files;
    })

    this.layoutService.themeColor$.subscribe(color => {
      this.hasWhiteTheme = color === "white" ? true : false;
    })

    this.loadData();

  }

  ngOnInit() {

  }

  loadData() {
    //retrieving data from back-end using websocket connection
    let loadedSettings = {
      "fontSize": new DoubleData(26, "Font-Size", "fontSize"),
      "theme": new DoubleData("eclipse", "Eclipse", "theme"),
      "gutter": new DoubleData(true, "Gutter", "gutter")
    };

    this.hasWhiteTheme = Constants.WHITE_THEMES.includes(loadedSettings["theme"].getValue()) ? true : false;

    Object.keys(loadedSettings).forEach(element => {
      Object.assign(this.settings, { ...this.settings, [element]: loadedSettings[element] });
    })

    this.files = [
      { value: 'project1', id: 1, path: '/axbg' },
      {
        value: 'project2', id: 3, path: '/axbg', children: [
          {
            id: 15,
            value: 'asd',
            path: '/axbg/project2'
          }
        ]
      }
    ];

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
