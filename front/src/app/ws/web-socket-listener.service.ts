// import { Injectable } from '@angular/core';
// import { Socket } from 'ngx-socket-io';
// import { DoubleData } from 'src/classes/DoubleData';
// import { NavigationTab } from 'src/classes/NavigationTab';
// import { WsEvent } from 'src/classes/WsEvent';
// import { ExecutionService } from '../execution.service';
// import { FilesEditingService } from '../files-editing.service';
// import { SettingsEditingServiceService } from '../settings-editing-service.service';
// import { TabEditingServiceService } from '../tab-editing-service.service';

// @Injectable({
//     providedIn: 'root'
// })
// export class WebSocketListenerService {
//     private tabEditingService: TabEditingServiceService;
//     private executionService: ExecutionService;
//     private filesEditingService: FilesEditingService;
//     private settingsEditingService: SettingsEditingServiceService;

//     constructor(private socket: Socket, tabEditingService: TabEditingServiceService,
//         executionService: ExecutionService, filesEditingService: FilesEditingService,
//         settingsEditingService: SettingsEditingServiceService
//     ) {
//         this.filesEditingService.actionFired$.subscribe((action) => {
//             //TO DO remove files input from files-panel and rely on .filesEditingService.actionFired$
//             this.socket.emit(WsEvent.COMMON.SAVE_FILES, action['files']);
//             switch (action['type']) {
//                 case 'create':
//                     this.socket.emit(WsEvent.COMMON.SAVE_FILE, {
//                         name: action['node'],
//                         path: action['path'],
//                         content: action['content'],
//                         directory: action['directory'],
//                     });
//                     break;
//                 case 'delete':
//                     this.socket.emit(WsEvent.COMMON.DELETE_FILE, {
//                         name: action['node'],
//                         path: action['path'],
//                     });
//                     this.filesEditingService.checkingFileOnDeletionOrRename({
//                         path: action['path'],
//                         name: action['node'],
//                     });
//                     break;
//                 case 'rename':
//                     this.socket.emit(WsEvent.COMMON.RENAME_FILE, {
//                         oldName: action['oldName'],
//                         newName: action['newName'],
//                         path: action['path'],
//                     });
//                     this.filesEditingService.checkingFileOnDeletionOrRename({
//                         path: action['path'],
//                         name: action['node'],
//                     });
//                     break;
//                 default:
//                     break;
//             }
//         });

//         this.tabEditingService.getFileSource$.subscribe((file) => {
//             this.socket.emit(WsEvent.COMMON.RETRIEVE_FILE, file);
//         });

//         this.executionService.getModifiedFile$.subscribe((file) => {
//             this.socket.emit(WsEvent.COMMON.STRUCTURE, {
//                 ...file.getEssentialData(),
//                 needToSave: true,
//             });
//         });

//         this.executionService.getUnmodifiedFile$.subscribe((file) => {
//             this.socket.emit(WsEvent.COMMON.STRUCTURE, {
//                 ...file.getEssentialData(),
//                 needToSave: false,
//             });
//         });

//         this.filesEditingService.saveFileSourceFired$.subscribe((file) => {
//             this.socket.emit(WsEvent.COMMON.SAVE_FILE, {
//                 name: file['title'],
//                 path: file['path'],
//                 content: file['content'],
//                 directory: false,
//             });
//         });

//         this.executionService.runOrDebugState$.subscribe((state) => {
//             // TODO call execution service an event to clean callback and variables

//             // TO DO move remove isDebugging as input from execution panel and rely on executionService.runOrDebugState$
//             this.isDebugging = <boolean>state;
//         });

//         this.executionService.getExecutionBreakpoints$.subscribe((breakpoints) => {

//             //remove breakpoints as input from execution panel and rely on executionService.getExecutionBreakpoints$
//             this.breakpoints = breakpoints;
//         });

//         this.executionService.newDataInput$.subscribe((input) => {
//             if (input['mode'] === 'run') {
//                 this.socket.emit(WsEvent.C.INPUT, input);
//             } else {
//                 this.socket.emit(WsEvent.C.DEBUG_INPUT, input);
//             }
//         });

//         this.executionService.sendDebugOptions$.subscribe((data) => {
//             // TODO call execution service an event to clean callback and variables
//             this.socket.emit(WsEvent.C.DEBUG_INPUT, { command: data });
//         });

//         this.executionService.invokeExecutionStop$.subscribe(() => {
//             // TODO call execution service an event to clean callback and variables
//             this.socket.emit(WsEvent.C.STOP);
//         });

//         this.settingsEditingService.savingSettings$.subscribe(() => {
//             // TO DO remove settings input from settings-panel and rely on settingsEditingService.savingSettings$
//             this.socket.emit(WsEvent.COMMON.SAVE_SETTINGS, this.settings);
//         });

//         this.bindWsListeners();
//     }

//     bindWsListeners() {
//         this.socket
//             .fromEvent(WsEvent.COMMON.LOADED_INITIAL_DATA)
//             .subscribe((data) => {
//                 if (data['data']['settings']) {
//                     Object.keys(data['data']['settings']).forEach((key) => {
//                         const em = new DoubleData(
//                             data['data']['settings'][key]['value'],
//                             data['data']['settings'][key]['label'],
//                             data['data']['settings'][key]['property']
//                         );
//                         // TO DO remove settings as input from settings panel and transfer values using a service
//                         Object.assign(this.settings, { ...this.settings, [key]: em });
//                     });
//                 }

//                 // TO DO move loadSettings method in settings panel
//                 this.loadSettings();

//                 // TO DO move files in files panel without receiving it as input
//                 //send them from here using a service
//                 this.files = [];
//                 if (data['data']['files']) {
//                     this.files = data['data']['files'];
//                 }

//                 // TO DO move files in files panel without receiving it as input
//                 // trigger it after receiving files from the aforementioned service
//                 this.filesLoaded = true;
//                 setTimeout(() => this.layoutService.initialData(), 1000);
//             });

//         this.socket.fromEvent(WsEvent.COMMON.RETRIEVED_FILE).subscribe((data) => {
//             const navTab = new NavigationTab(
//                 data['file']['id'],
//                 data['file']['title'],
//                 data['content'],
//                 data['file']['path'],
//                 0
//             );
//             this.tabEditingService.openNewTab(navTab);
//         });

//         this.socket.fromEvent(WsEvent.COMMON.STRUCTURED).subscribe((data: any) => {
//             if (data['needToSave']) {
//                 this.socket.emit(WsEvent.COMMON.SAVE, data);
//                 (<HTMLElement>(
//                     document.querySelector('.ui-tabview-selected')
//                 )).removeAttribute('style');
//                 // move isDebugging logic 
//             } else if (!this.isDebugging) {
//                 switch (data['title'].split('.')[1]) {
//                     case 'c':
//                     case 'cpp':
//                         this.socket.emit(WsEvent.C.RUN, data);
//                         break;
//                     default:
//                         break;
//                 }
//             } else {
//                 // TODO call execution service an event to clea callback and variables
//                 Object.assign(data, { ...data, breakpoints: this.breakpoints });
//                 switch (data['title'].split('.')[1]) {
//                     case 'c':
//                     case 'cpp':
//                         this.socket.emit(WsEvent.C.DEBUG, data);
//                         break;
//                     default:
//                         break;
//                 }
//             }
//         });

//         this.socket.fromEvent(WsEvent.COMMON.SAVED).subscribe((data: any) => {
//             if (!this.isDebugging) {
//                 // TODO call execution service am event to disable buttons
//                 switch (data['title'].split('.')[1]) {
//                     case 'c':
//                     case 'cpp':
//                         this.socket.emit(WsEvent.C.RUN, data);
//                         break;
//                     default:
//                         break;
//                 }
//             } else {
//                 // TODO call execution service am event to disable buttons
//                 // TODO call execution service an event to clea callback and variables
//                 Object.assign(data, { ...data, breakpoints: this.breakpoints });
//                 switch (data['title'].split('.')[1]) {
//                     case 'c':
//                     case 'cpp':
//                         this.socket.emit(WsEvent.C.DEBUG, data);
//                         break;
//                     default:
//                         break;
//                 }
//             }
//         });

//         this.socket.fromEvent(WsEvent.COMMON.ERROR).subscribe(() => {
//             alert('An error occurred - please try again');
//         });

//         this.socket.fromEvent(WsEvent.COMMON.ERROR_FILE).subscribe(() => {
//             alert('An error occurred while reading the file - please try again');
//         });

//         // c-run related
//         // TODO extract in WebSocketCInterface
//         this.socket.fromEvent(WsEvent.C.OUTPUT).subscribe((data) => {
//             let stg = <string>data;
//             stg = stg.replace(new RegExp('\r?\n', 'g'), 'ᚠ');
//             this.executionService.renderOutput(stg + '　');
//         });

//         this.socket.fromEvent(WsEvent.C.ERROR).subscribe((data) => {
//             alert('Error happened. Please try again.');
//         });

//         this.socket.fromEvent(WsEvent.C.COMPILATION_ERROR).subscribe((data) => {
//             (<Array<any>>data).forEach((element, index) => {
//                 if (index === 0) {
//                     element = 'error' + element;
//                 }
//                 this.executionService.renderOutput(element);
//             });
//         });

//         this.socket.fromEvent(WsEvent.C.FINISHED).subscribe((data) => {
//             // TODO call execution service an event to clean callback and variables
//             this.executionService.renderOutput('finished　');
//         });

//         // c-debug-related
//         this.socket.fromEvent(WsEvent.C.DEBUG_OUTPUT).subscribe((data) => {
//             let stg = <string>data;
//             if (!stg.includes('/back/controllers') && !stg.includes('/back/files/')) {
//                 stg = stg.replace(new RegExp('\r?\n', 'g'), 'ᚠ');
//                 this.executionService.renderOutput(stg + '　');
//             } else if (stg.includes('Breakpoint')) {
//                 // TODO call execution service an event to clean callback and variables
//                 this.executionService.renderOutput('\n　');
//                 this.executionService.renderOutput(
//                     '\nbreakpoint hit:　line ' + stg.split('\n')[3] + '\n'
//                 );
//                 this.executionService.renderOutput('\n　');
//             }
//         });

//         this.socket.fromEvent(WsEvent.C.DEBUG_STACK).subscribe((data) => {
//             const callstack: string[] = [];
//             (<Array<any>>data).forEach((element) => {
//                 callstack.push(<string>element);
//             });

//             // TODO send callstack to execution panel
//         });

//         this.socket.fromEvent(WsEvent.C.DEBUG_VARIABLES).subscribe((data) => {
//             const variables: Map<string, string> = new Map<string, string>();
//             const splitted: string[] = (<string>data)
//                 .split(/=|\n/)
//                 .filter((element) => element !== ' ' && element !== '');

//             for (let i = 0; i < splitted.length; i += 2) {
//                 variables.set(splitted[i], splitted[i + 1]);
//             }

//             // TODO send variables to execution panel
//         });

//         this.socket.fromEvent(WsEvent.C.DEBUG_FINISHED).subscribe((data) => {
//             this.executionService.renderOutput('finished　');
//         });
//     }
// }

