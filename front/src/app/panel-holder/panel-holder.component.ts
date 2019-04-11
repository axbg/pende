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
  breakpoints: number[];
  debugInitMessages = 0;
  variables: Map<string, string> = new Map<string, string>();
  callstack: string[] = [];
  filesLoaded: boolean = false;

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
    })

    this.filesEditingService.actionFired$.subscribe(action => {
      this.files = action["files"];
      this.socket.emit("save-files", action["files"])
      switch (action["type"]) {
        case "create":
          this.socket.emit("save-file", {
            name: action["node"], path: action["path"],
            content: action["content"], directory: action["directory"]
          })
          break;
        case "delete":
          this.socket.emit("delete-file", {
            name: action["node"], path: action["path"],
          })
          this.filesEditingService.checkingFileOnDeletionOrRename({ path: action["path"], name: action["node"] });
          break;
        case "rename":
          this.socket.emit("rename-file", {
            oldName: action["oldName"], newName: action["newName"], path: action["path"]
          })
          this.filesEditingService.checkingFileOnDeletionOrRename({ path: action["path"], name: action["node"] });
          break;
        default:
          break;
      }
    })

    this.tabEditingService.getFileSource$.subscribe(file => {
      this.socket.emit("retrieve-file", file);
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

    this.filesEditingService.saveFileShortcutFired$.subscribe(file => {
      this.socket.emit("save-file", {
        name: file["title"], path: file["path"],
        content: file["content"], directory: false
      })
    })

    this.executionService.newDataInput$.subscribe(input => {
      if (input["mode"] === "run") {
        this.socket.emit("c-input", input);
      } else {
        this.socket.emit("c-debug-input", input);
      }
    })

    this.executionService.runOrDebugState$.subscribe(state => {
      this.variables.clear();
      this.callstack = [];
      this.isDebugging = <boolean>state;
    })

    this.executionService.getExecutionBreakpoints$.subscribe(breakpoints => {
      this.breakpoints = breakpoints;
    })

    this.executionService.sendDebugOptions$.subscribe((data) => {
      this.socket.emit("c-debug-input", { command: data });
    })

    this.executionService.invokeExecutionStop$.subscribe(() => {
      this.socket.emit("c-stop");
    });

    //user settings and file management
    this.settingsEditingService.savingSettings$.subscribe(() => {
      this.socket.emit("save-settings", this.settings);
    })

    this.wsHandlers();

  }

  ngOnInit() {
  }

  wsHandlers() {

    this.socket.fromEvent("loaded-initial-data").subscribe(data => {

      if (data["data"]["settings"]) {
        Object.keys(data["data"]["settings"]).forEach((key) => {
          let em = new DoubleData(data["data"]["settings"][key]["value"], data["data"]["settings"][key]["label"],
            data["data"]["settings"][key]["property"]);
          Object.assign(this.settings, { ...this.settings, [key]: em });
        })
      }

      this.hasWhiteTheme = Constants.WHITE_THEMES.includes(this.settings["theme"].getValue()) ? true : false;
      this.loadSettings();

      this.files = [];
      if (data["data"]["files"]) {
        this.files = data["data"]["files"]
      }

      this.filesLoaded = true;
      setTimeout(() => this.layoutService.initialData(), 1000);
    });


    this.socket.fromEvent("retrieved-file").subscribe(data => {
      let navTab = new NavigationTab(data["file"]["id"], data["file"]["title"], data["content"],
        data["file"]["path"], 0);
      this.tabEditingService.openNewTab(navTab);
    })

    this.socket.fromEvent("structured").subscribe(data => {
      if (data["needToSave"]) {
        this.socket.emit("save", data);
        (<HTMLElement>document.querySelector(".ui-tabview-selected")).removeAttribute("style");
      } else if (!this.isDebugging) {
        switch (data["title"].split(".")[1]) {
          case "c":
            this.socket.emit("c-run", data);
            break;
          case "cpp":
            this.socket.emit("c-run", data);
            break;
          default:
            break;
        }
      } else {
        this.variables.clear();
        this.callstack = [];
        Object.assign(data, { ...data, breakpoints: this.breakpoints })
        switch (data["title"].split(".")[1]) {
          case "c":
            this.socket.emit("c-debug", data);
            break;
          case "cpp":
            this.socket.emit("c-debug", data);
            break;
          default:
            break;
        }
      }
    })

    this.socket.fromEvent("saved").subscribe(data => {
      if (!this.isDebugging) {
        this.changeButtonStatus("disable");
        switch (data["title"].split(".")[1]) {
          case "c":
            this.socket.emit("c-run", data);
            break;
          case "cpp":
            this.socket.emit("c-run", data);
            break;
          default:
            break;
        }
      } else {
        this.changeButtonStatus("disable");
        this.variables.clear();
        this.callstack = [];
        Object.assign(data, { ...data, breakpoints: this.breakpoints })
        switch (data["title"].split(".")[1]) {
          case "c":
            this.socket.emit("c-debug", data);
            break;
          case "cpp":
            this.socket.emit("c-debug", data);
            break;
          default:
            break;
        }
      }
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

    this.socket.fromEvent("c-compilation-error").subscribe(data => {
      (<Array<any>>data).forEach((element, index) => {
        if (index === 0) {
          element = "error" + element;
        }
        this.executionService.renderOutput(element);
      });
    })

    this.socket.fromEvent("c-finished").subscribe(data => {
      this.changeButtonStatus();
      this.executionService.renderOutput("finished　");
    })

    //c-debug-related
    this.socket.fromEvent("c-debug-output").subscribe(data => {
      let stg = <string>data;
      if (!stg.includes("/back/controllers") && !stg.includes("/back/files/")) {
        stg = stg.replace(new RegExp('\r?\n', 'g'), 'ᚠ');
        this.executionService.renderOutput(stg + "　");
      } else if (stg.includes("Breakpoint")) {
        this.callstack = [];
        this.variables.clear();
        this.executionService.renderOutput("\n　");
        this.executionService.renderOutput("\nbreakpoint hit:　line " + stg.split("\n")[3] + "\n");
        this.executionService.renderOutput("\n　");
      }
    })

    this.socket.fromEvent("c-debug-stack").subscribe(data => {
      (<Array<any>>data).forEach(element => {
        this.callstack.push(<string>element);
      });
    })

    this.socket.fromEvent("c-debug-variables").subscribe(data => {
      let splitted: string[] = (<string>data).split(/=|\n/).filter(element => element !== " " && element !== "");
      for (let i = 0; i < splitted.length; i += 2) {
        this.variables.set(splitted[i], splitted[i + 1]);
      }
    })

    this.socket.fromEvent("c-debug-finish").subscribe(data => {
      this.changeButtonStatus();
      this.executionService.renderOutput("finished　");
      this.callstack = [];
      this.variables.clear();
    })
  }

  //refactor this
  //pas the button statuses as a props and modify them inside angular execution panel
  //without manipulating the dom directly
  changeButtonStatus(status?) {
    let em1 = <HTMLElement>document.getElementById("run");
    let em2 = <HTMLElement>document.getElementById("debug");
    if (status === "disable") {
      em1.setAttribute("disabled", "true");
      em1.setAttribute("style", "color: #666666 !important;");
      em1.style.setProperty("border", "1px solid #999999");
      em2.setAttribute("disabled", "true");
      em2.setAttribute("style", "color: #666666 !important;");
      em2.style.setProperty("border", "1px solid #999999");
    } else {
      em1.removeAttribute("disabled");
      em1.removeAttribute("style");
      em2.removeAttribute("disabled");
      em2.removeAttribute("style");
    }
  }

  loadSettings() {
    setTimeout(() => {
      Object.keys(this.settings).forEach(setting => {
        this.settingsEditingService.modifySettings(this.settings[setting]);
      })
    }, 50);
  }

}
