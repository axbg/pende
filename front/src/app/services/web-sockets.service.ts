import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { SettingData } from '../classes/SettingData';
import { NavigationTab } from '../classes/NavigationTab';
import { WsEvent } from '../classes/WsEvent';
import { ExecutionService } from './execution.service';
import { FileService } from './file-service';
import { LayoutService } from './layout.service';
import { SettingService } from './setting-service';
import { TabService } from './tab-service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketsService {
  private isDebugging: Boolean = false;
  private breakpoints: number[] = [];

  constructor(private fileService: FileService, private socket: Socket,
              private layoutService: LayoutService, private settingsService: SettingService,
              private executionService: ExecutionService, private tabService: TabService) {
    this.bindStatefulListeners();
    this.bindCommonWsListeners();
    this.bindCppWsListeners();

    this.bindFileServiceListeners();
    this.bindSettingServiceListeners();
    this.bindExecutionServiceListeners();
    this.bindTabServiceListeners();
  }

  bindStatefulListeners() {
    this.executionService.executionBreakpointsObservable$.subscribe((breakpoints) => {
      this.breakpoints = breakpoints;
    });

    this.executionService.debugStatusObservable$.subscribe(status => {
      this.isDebugging = status;
    });
  }

  bindCommonWsListeners() {
    this.socket
      .fromEvent(WsEvent.COMMON.LOADED_INITIAL_DATA)
      .subscribe((data: any) => {
        let files: any[] = [];
        const settings: any[] = [];

        if (data.data.settings) {
          Object.keys(data.data.settings).forEach((key) => {
            const em = new SettingData(
              data.data.settings[key].value,
              data.data.settings[key].label,
              data.data.settings[key].property
            );
            Object.assign(settings, { ...settings, [key]: em });
          });
        }

        if (data.data.files) {
          files = data.data.files;
        }

        this.settingsService.loadSettings(settings);
        Object.keys(settings).map((setting: any) => {
          this.layoutService.changeSettings(settings[setting]);
        });

        this.fileService.loadFiles(files);
        setTimeout(() => this.layoutService.loadInitialData(), 1000);
      });

    this.socket.fromEvent(WsEvent.COMMON.RETRIEVED_FILE).subscribe((data: any) => {
      const navTab = new NavigationTab(
        data.file.id,
        data.file.title,
        data.content,
        data.file.path,
        0
      );
      this.tabService.openNewTab(navTab);
    });

    this.socket.fromEvent(WsEvent.COMMON.STRUCTURED).subscribe((data: any) => {
      if (data.needToSave) {
        this.socket.emit(WsEvent.COMMON.SAVE, data);
      } else if (!this.isDebugging) {
        this.executionService.changeButtonsStatus(false);
        switch (data.title.split('.')[1]) {
          case 'c':
          case 'cpp':
            this.socket.emit(WsEvent.C.RUN, data);
            break;
          default:
            break;
        }
      } else {
        this.executionService.changeButtonsStatus(false);
        this.executionService.clearDebugOutput();
        Object.assign(data, { ...data, breakpoints: this.breakpoints });
        switch (data.title.split('.')[1]) {
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
        this.executionService.changeButtonsStatus(false);

        switch (data.title.split('.')[1]) {
          case 'c':
          case 'cpp':
            this.socket.emit(WsEvent.C.RUN, data);
            break;
          default:
            break;
        }
      } else {
        this.executionService.changeButtonsStatus(false);
        this.executionService.clearDebugOutput();

        Object.assign(data, { ...data, breakpoints: this.breakpoints });

        switch (data.title.split('.')[1]) {
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
  }

  bindCppWsListeners() {
    this.socket.fromEvent(WsEvent.C.OUTPUT).subscribe((data) => {
      let stg = data as string;
      stg = stg.replace(new RegExp('\r?\n', 'g'), 'ᚠ');
      this.executionService.renderTerminalData(stg + '　');
    });

    this.socket.fromEvent(WsEvent.C.ERROR).subscribe((data) => {
      alert('Error happened. Please try again.');
    });

    this.socket.fromEvent(WsEvent.C.COMPILATION_ERROR).subscribe((data) => {
      (data as Array<any>).forEach((element, index) => {
        if (index === 0) {
          element = 'error' + element;
        }
        this.executionService.renderTerminalData(element);
      });
    });

    this.socket.fromEvent(WsEvent.C.FINISHED).subscribe((data) => {
      this.executionService.changeButtonsStatus(true);
      this.executionService.renderTerminalData('finished　');
    });

    this.socket.fromEvent(WsEvent.C.DEBUG_OUTPUT).subscribe((data) => {
      let stg = data as string;
      if (!stg.includes('/back/controllers') && !stg.includes('/back/files/')) {
        stg = stg.replace(new RegExp('\r?\n', 'g'), 'ᚠ');
        this.executionService.renderTerminalData(stg + '　');
      } else if (stg.includes('Breakpoint')) {
        this.executionService.clearDebugOutput();
        this.executionService.renderTerminalData('\n　');
        this.executionService.renderTerminalData(
          '\nbreakpoint hit:　line ' + stg.split('\n')[3] + '\n'
        );
        this.executionService.renderTerminalData('\n　');
      }
    });

    this.socket.fromEvent(WsEvent.C.DEBUG_STACK).subscribe((data) => {
      const callstack: any[] = [];
      (data as Array<any>).forEach((element) => {
        callstack.push(element as string);
      });

      this.executionService.passCallstack(callstack);
    });

    this.socket.fromEvent(WsEvent.C.DEBUG_VARIABLES).subscribe((data) => {
      const variables: Map<string, string> = new Map<string, string>();
      const splitted: string[] = (data as string).split(/=|\n/)
        .filter((element) => element !== ' ' && element !== '');
      for (let i = 0; i < splitted.length; i += 2) {
        variables.set(splitted[i], splitted[i + 1]);
      }

      this.executionService.passVariables(variables);
    });

    this.socket.fromEvent(WsEvent.C.DEBUG_FINISHED).subscribe((data) => {
      this.executionService.changeButtonsStatus(true);
      this.executionService.renderTerminalData('finished　');
      this.executionService.clearDebugOutput();
    });
  }

  bindFileServiceListeners() {
    this.fileService.fileActionObservable$.subscribe((action: any) => {
      this.socket.emit(WsEvent.COMMON.SAVE_FILES, action.files);
      switch (action.type) {
        case 'create':
          this.socket.emit(WsEvent.COMMON.SAVE_FILE, {
            name: action.node,
            path: action.path,
            content: action.content,
            directory: action.directory,
          });
          break;
        case 'delete':
          this.socket.emit(WsEvent.COMMON.DELETE_FILE, {
            name: action.node,
            path: action.path,
          });
          this.fileService.closeTabOnFileChange({
            path: action.path,
            name: action.node,
          });
          break;
        case 'rename':
          this.socket.emit(WsEvent.COMMON.RENAME_FILE, {
            oldName: action.oldName,
            newName: action.newName,
            path: action.path,
          });
          this.fileService.closeTabOnFileChange({
            path: action.path,
            name: action.node,
          });
          break;
        default:
          break;
      }
    });

    this.fileService.saveFileObservable$.subscribe((file: any) => {
      this.socket.emit(WsEvent.COMMON.SAVE_FILE, {
        name: file.title,
        path: file.path,
        content: file.content,
        directory: false,
      });
    });
  }

  bindSettingServiceListeners() {
    this.settingsService.saveSettingsObservable$.subscribe((settings) => {
      this.socket.emit(WsEvent.COMMON.SAVE_SETTINGS, { ...settings });
    });
  }

  bindExecutionServiceListeners() {
    this.executionService.modifyFileObservable$.subscribe((file) => {
      this.socket.emit(WsEvent.COMMON.STRUCTURE, {
        ...file.getEssentialData(),
        needToSave: true,
      });
    });

    this.executionService.unmodifyFileObservable$.subscribe((file) => {
      this.socket.emit(WsEvent.COMMON.STRUCTURE, {
        ...file.getEssentialData(),
        needToSave: false,
      });
    });

    this.executionService.inputDataObservable$.subscribe((input: any) => {
      if (input.mode === 'run') {
        this.socket.emit(WsEvent.C.INPUT, input);
      } else {
        this.socket.emit(WsEvent.C.DEBUG_INPUT, input);
      }
    });

    this.executionService.debuggingOptionsObservable$.subscribe((data) => {
      this.socket.emit(WsEvent.C.DEBUG_INPUT, { command: data });
    });

    this.executionService.stopExecutionObservable$.subscribe(() => {
      this.socket.emit(WsEvent.C.STOP);
    });
  }

  bindTabServiceListeners() {
    this.tabService.notifyFileChangedObservable$.subscribe((file) => {
      this.socket.emit(WsEvent.COMMON.RETRIEVE_FILE, file);
    });
  }
}
