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
  isDebugging: boolean = false;


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
      let content = `#include<stdio.h>

int main() {
  setbuf(stdout, NULL);
      
  int x, y;
      
  printf("Enter x : ");
      
  scanf("%d", &x);
      
  printf("Enter y : ");

      
  scanf("%d", &y);
      
  printf("Value entered y is %d\\n", y);
  printf("Value entered x is %d\\n", x);
      
  return 0;
}`;
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

    this.executionService.getModifiedFile$.subscribe(file => {
      this.socket.emit("structure", { ...file.getEssentialData(), needToSave: true });
    });

    this.executionService.getUnmodifiedFile$.subscribe(file => {
      this.socket.emit("structure", { ...file.getEssentialData(), needToSave: false });
    })

    this.executionService.newDataInput$.subscribe(input => {
      this.socket.emit("c-input", input);
    })

    this.executionService.runOrDebugState$.subscribe(state => {
      this.isDebugging = <boolean>state;
    })

    this.wsHandlers();
    this.loadData();

  }

  ngOnInit() {

  }

  wsHandlers() {

    this.socket.fromEvent("structured").subscribe(data => {
      if (!this.isDebugging) {
        if (data["needToSave"]) {
          this.socket.emit("save", data);
        } else {
          this.socket.emit("c-run", data);
        }
      } else {
        console.log("debugging");
      }
    })

    this.socket.fromEvent("saved").subscribe(data => {
      console.log("saved");
      //check file extension to call different endpoints
      this.socket.emit("c-run", data);
    })

    //c-run related
    this.socket.fromEvent("c-output").subscribe(data => {
      let stg = <string>data;
      stg = stg.replace(new RegExp('\r?\n', 'g'), 'ᚠ');
      this.executionService.renderOutput(stg + "　");
    })

    this.socket.fromEvent("c-error").subscribe(data => {
      alert("Error happened. Please try again.");
    })

    this.socket.fromEvent("c-finished").subscribe(data => {
      this.executionService.renderOutput("finished　");
    })

    //c-debug-related
  }

  loadData() {
    //retrieving data from back-end using websocket connection
    let loadedSettings = {
      "fontSize": new DoubleData(20, "Font-Size", "fontSize"),
      "theme": new DoubleData("eclipse", "Eclipse", "theme"),
      "gutter": new DoubleData(true, "Gutter", "gutter")
    };

    this.hasWhiteTheme = Constants.WHITE_THEMES.includes(loadedSettings["theme"].getValue()) ? true : false;

    Object.keys(loadedSettings).forEach(element => {
      Object.assign(this.settings, { ...this.settings, [element]: loadedSettings[element] });
    })

    this.files = [
      { value: 'project1', id: 1, path: '/' },
      {
        value: 'project2', id: 3, path: '/', children: [
          {
            id: 15,
            value: 'test.c',
            path: '/project2'
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
