import { Component, OnInit, Input } from '@angular/core';
import { TabEditingServiceService } from 'src/app/services/tab-editing-service.service';
import { DoubleData } from 'src/app/classes/DoubleData';
import { SettingsEditingServiceService } from 'src/app/services/settings-editing-service.service';
import { NavigationTab } from 'src/app/classes/NavigationTab';
import { FilesEditingService } from 'src/app/services/files-editing.service';
import { LayoutService } from 'src/app/services/layout.service';
import { WsEvent } from 'src/app/classes/WsEvent';
import { ExecutionService } from 'src/app/services/execution.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-panel-holder',
  templateUrl: './panel-holder.component.html',
  styleUrls: ['./panel-holder.component.css'],
})
export class PanelHolderComponent implements OnInit {
  @Input() panel: String;

  settings: Object = {};
  files: any;
  hasWhiteTheme: boolean;
  isDebugging = false;
  breakpoints: number[];
  debugInitMessages = 0;
  variables: Map<string, string> = new Map<string, string>();
  callstack: string[] = [];
  filesLoaded = false;
  themeColor: String = 'white';
  tabOpened = false;

  constructor(
    private tabEditingService: TabEditingServiceService,
    private settingsEditingService: SettingsEditingServiceService,
    private filesEditingService: FilesEditingService,
    private executionService: ExecutionService,
    private layoutService: LayoutService,
    private socket: Socket
  ) {
    this.tabEditingService.menuPanel$.subscribe((payload) => {
      this.panel = payload;
    });

    const tabOpenedSub = this.tabEditingService.tabOpened$.subscribe((tab) => {
      if (tab) {
        this.tabOpened = true;
        tabOpenedSub.unsubscribe();
      }
    });

    this.settingsEditingService.modifiedSettings$.subscribe((payload) => {
      const property: any = payload['property'];
      Object.assign(this.settings, { ...this.settings, [property]: payload });

      this.layoutService.changeSettings(payload);
    });

    this.layoutService.settingsChanged$.subscribe((payload) => {
      if (payload.getProperty() === 'theme') {
        this.themeColor = payload.getColor();
      }
    });

    this.filesEditingService.actionFired$.subscribe((action) => {
      console.log(action);
      this.files = action['files'];
      this.socket.emit(WsEvent.COMMON.SAVE_FILES, action['files']);
      switch (action['type']) {
        case 'create':
          this.socket.emit(WsEvent.COMMON.SAVE_FILE, {
            name: action['node'],
            path: action['path'],
            content: action['content'],
            directory: action['directory'],
          });
          break;
        case 'delete':
          this.socket.emit(WsEvent.COMMON.DELETE_FILE, {
            name: action['node'],
            path: action['path'],
          });
          this.filesEditingService.checkingFileOnDeletionOrRename({
            path: action['path'],
            name: action['node'],
          });
          break;
        case 'rename':
          this.socket.emit(WsEvent.COMMON.RENAME_FILE, {
            oldName: action['oldName'],
            newName: action['newName'],
            path: action['path'],
          });
          this.filesEditingService.checkingFileOnDeletionOrRename({
            path: action['path'],
            name: action['node'],
          });
          break;
        default:
          break;
      }
    });

    this.tabEditingService.getFileSource$.subscribe((file) => {
      this.socket.emit(WsEvent.COMMON.RETRIEVE_FILE, file);
    });

    this.filesEditingService.updateStoreFired$.subscribe((files) => {
      this.files = files;
    });

    this.executionService.getModifiedFile$.subscribe((file) => {
      this.socket.emit(WsEvent.COMMON.STRUCTURE, {
        ...file.getEssentialData(),
        needToSave: true,
      });
    });

    this.executionService.getUnmodifiedFile$.subscribe((file) => {
      this.socket.emit(WsEvent.COMMON.STRUCTURE, {
        ...file.getEssentialData(),
        needToSave: false,
      });
    });

    this.filesEditingService.saveFileSourceFired$.subscribe((file) => {
      this.socket.emit(WsEvent.COMMON.SAVE_FILE, {
        name: file['title'],
        path: file['path'],
        content: file['content'],
        directory: false,
      });
    });

    this.executionService.newDataInput$.subscribe((input) => {
      if (input['mode'] === 'run') {
        this.socket.emit(WsEvent.C.INPUT, input);
      } else {
        this.socket.emit(WsEvent.C.DEBUG_INPUT, input);
      }
    });

    this.executionService.runOrDebugState$.subscribe((state) => {
      this.clearDebugOutputs();
      this.isDebugging = <boolean>state;
    });

    this.executionService.getExecutionBreakpoints$.subscribe((breakpoints) => {
      this.breakpoints = breakpoints;
    });

    this.executionService.sendDebugOptions$.subscribe((data) => {
      this.clearDebugOutputs();
      this.socket.emit(WsEvent.C.DEBUG_INPUT, { command: data });
    });

    this.executionService.invokeExecutionStop$.subscribe(() => {
      this.clearDebugOutputs();
      this.socket.emit(WsEvent.C.STOP);
    });

    this.settingsEditingService.savingSettings$.subscribe(() => {
      this.socket.emit(WsEvent.COMMON.SAVE_SETTINGS, this.settings);
    });

    this.wsHandlers();
  }

  ngOnInit() {}

  clearDebugOutputs() {
    this.variables.clear();
    this.callstack = [];
  }

  wsHandlers() {
    this.socket
      .fromEvent(WsEvent.COMMON.LOADED_INITIAL_DATA)
      .subscribe((data) => {
        if (data['data']['settings']) {
          Object.keys(data['data']['settings']).forEach((key) => {
            const em = new DoubleData(
              data['data']['settings'][key]['value'],
              data['data']['settings'][key]['label'],
              data['data']['settings'][key]['property']
            );
            Object.assign(this.settings, { ...this.settings, [key]: em });
          });
        }

        this.loadSettings();

        this.files = [];
        if (data['data']['files']) {
          this.files = data['data']['files'];
        }

        this.filesLoaded = true;
        setTimeout(() => this.layoutService.initialData(), 1000);
      });

    this.socket.fromEvent(WsEvent.COMMON.RETRIEVED_FILE).subscribe((data) => {
      const navTab = new NavigationTab(
        data['file']['id'],
        data['file']['title'],
        data['content'],
        data['file']['path'],
        0
      );
      this.tabEditingService.openNewTab(navTab);
    });

    this.socket.fromEvent(WsEvent.COMMON.STRUCTURED).subscribe((data: any) => {
      if (data['needToSave']) {
        this.socket.emit(WsEvent.COMMON.SAVE, data);
        (<HTMLElement>(
          document.querySelector('.ui-tabview-selected')
        )).removeAttribute('style');
      } else if (!this.isDebugging) {
        switch (data['title'].split('.')[1]) {
          case 'c':
          case 'cpp':
            this.socket.emit(WsEvent.C.RUN, data);
            break;
          default:
            break;
        }
      } else {
        this.clearDebugOutputs();
        Object.assign(data, { ...data, breakpoints: this.breakpoints });
        switch (data['title'].split('.')[1]) {
          case 'c':
          case 'cpp':
            this.socket.emit(WsEvent.C.DEBUG, data);
            break;
          default:
            break;
        }
      }
    });

    this.socket.fromEvent(WsEvent.COMMON.SAVED).subscribe((data: any) => {
      if (!this.isDebugging) {
        this.changeButtonStatus('disable');
        switch (data['title'].split('.')[1]) {
          case 'c':
          case 'cpp':
            this.socket.emit(WsEvent.C.RUN, data);
            break;
          default:
            break;
        }
      } else {
        this.changeButtonStatus('disable');
        this.clearDebugOutputs();
        Object.assign(data, { ...data, breakpoints: this.breakpoints });
        switch (data['title'].split('.')[1]) {
          case 'c':
          case 'cpp':
            this.socket.emit(WsEvent.C.DEBUG, data);
            break;
          default:
            break;
        }
      }
    });

    this.socket.fromEvent(WsEvent.COMMON.ERROR).subscribe(() => {
      alert('An error occurred - please try again');
    });

    this.socket.fromEvent(WsEvent.COMMON.ERROR_FILE).subscribe(() => {
      alert('An error occurred while reading the file - please try again');
    });

    // c-run related
    this.socket.fromEvent(WsEvent.C.OUTPUT).subscribe((data) => {
      let stg = <string>data;
      stg = stg.replace(new RegExp('\r?\n', 'g'), 'ᚠ');
      this.executionService.renderOutput(stg + '　');
    });

    this.socket.fromEvent(WsEvent.C.ERROR).subscribe((data) => {
      alert('Error happened. Please try again.');
    });

    this.socket.fromEvent(WsEvent.C.COMPILATION_ERROR).subscribe((data) => {
      (<Array<any>>data).forEach((element, index) => {
        if (index === 0) {
          element = 'error' + element;
        }
        this.executionService.renderOutput(element);
      });
    });

    this.socket.fromEvent(WsEvent.C.FINISHED).subscribe((data) => {
      this.changeButtonStatus();
      this.executionService.renderOutput('finished　');
    });

    // c-debug-related
    this.socket.fromEvent(WsEvent.C.DEBUG_OUTPUT).subscribe((data) => {
      let stg = <string>data;
      if (!stg.includes('/back/controllers') && !stg.includes('/back/files/')) {
        stg = stg.replace(new RegExp('\r?\n', 'g'), 'ᚠ');
        this.executionService.renderOutput(stg + '　');
      } else if (stg.includes('Breakpoint')) {
        this.clearDebugOutputs();
        this.executionService.renderOutput('\n　');
        this.executionService.renderOutput(
          '\nbreakpoint hit:　line ' + stg.split('\n')[3] + '\n'
        );
        this.executionService.renderOutput('\n　');
      }
    });

    this.socket.fromEvent(WsEvent.C.DEBUG_STACK).subscribe((data) => {
      (<Array<any>>data).forEach((element) => {
        this.callstack.push(<string>element);
      });
    });

    this.socket.fromEvent(WsEvent.C.DEBUG_VARIABLES).subscribe((data) => {
      const splitted: string[] = (<string>data)
        .split(/=|\n/)
        .filter((element) => element !== ' ' && element !== '');
      for (let i = 0; i < splitted.length; i += 2) {
        this.variables.set(splitted[i], splitted[i + 1]);
      }
    });

    this.socket.fromEvent(WsEvent.C.DEBUG_FINISHED).subscribe((data) => {
      this.changeButtonStatus();
      this.executionService.renderOutput('finished　');
      this.clearDebugOutputs();
    });
  }

  // refactor this
  // pas the button statuses as a props and modify them inside angular execution panel
  // without manipulating the dom directly
  changeButtonStatus(status?) {
    const em1 = <HTMLElement>document.getElementById('run');
    const em2 = <HTMLElement>document.getElementById('debug');
    if (status === 'disable') {
      em1.setAttribute('disabled', 'true');
      em1.setAttribute('style', 'color: #666666 !important;');
      em1.style.setProperty('border', '1px solid #999999');
      em2.setAttribute('disabled', 'true');
      em2.setAttribute('style', 'color: #666666 !important;');
      em2.style.setProperty('border', '1px solid #999999');
    } else {
      em1.removeAttribute('disabled');
      em1.removeAttribute('style');
      em2.removeAttribute('disabled');
      em2.removeAttribute('style');
    }
  }

  loadSettings() {
    setTimeout(() => {
      Object.keys(this.settings).forEach((setting) => {
        this.settingsEditingService.modifySettings(this.settings[setting]);
      });
    }, 50);
  }
}
