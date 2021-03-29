import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NavigationTab } from 'src/app/classes/NavigationTab';

@Injectable({
  providedIn: 'root'
})
export class ExecutionService {
  private checkFileStatusSubject = new Subject();
  private modifyFileSubject = new Subject<NavigationTab>();
  private unmodifyFileSubject = new Subject<NavigationTab>();
  private showBreakpointsSubject = new Subject();
  private executionBreakpointsSubject = new Subject<number[]>();
  private renderTerminalDataSubject = new Subject<Object>();
  private inputDataSubject = new Subject<Object>();
  private runOrDebugSubject = new Subject<Object>();
  private debuggingOptionsSubject = new Subject<String>();
  private stopExecutionSubject = new Subject();
  private changeButtonsStatusSubject = new Subject<Boolean>();
  private passCallstackSubject = new Subject<any[]>();
  private passVariablesSubject = new Subject<Map<string, string>>();
  private debugStatusSubject = new Subject<Boolean>();
  private clearDebugOutputSubject = new Subject();

  checkFileStatusObservable$ = this.checkFileStatusSubject.asObservable();
  modifyFileObservable$ = this.modifyFileSubject.asObservable();
  unmodifyFileObservable$ = this.unmodifyFileSubject.asObservable();
  showBreakpointsObservable$ = this.showBreakpointsSubject.asObservable();
  executionBreakpointsObservable$ = this.executionBreakpointsSubject.asObservable();
  renderTerminalDataObservable$ = this.renderTerminalDataSubject.asObservable();
  inputDataObservable$ = this.inputDataSubject.asObservable();
  runOrDebugObservable$ = this.runOrDebugSubject.asObservable();
  debuggingOptionsObservable$ = this.debuggingOptionsSubject.asObservable();
  stopExecutionObservable$ = this.stopExecutionSubject.asObservable();
  changeButtonsStatusObservable$ = this.changeButtonsStatusSubject.asObservable();
  passCallstackObservable$ = this.passCallstackSubject.asObservable();
  passVariablesObservable$ = this.passVariablesSubject.asObservable();
  debugStatusObservable$ = this.debugStatusSubject.asObservable();
  clearDebugOutputObservable$ = this.clearDebugOutputSubject.asObservable();

  constructor() { }

  checkFileStatus() {
    this.checkFileStatusSubject.next();
  }

  modifyFile(tab: NavigationTab) {
    this.modifyFileSubject.next(tab);
  }

  unmodifyFile(tab: NavigationTab) {
    this.unmodifyFileSubject.next(tab);
  }

  showBreakpoints() {
    this.showBreakpointsSubject.next();
  }

  executionBreakpoints(breakpoints: number[]) {
    this.executionBreakpointsSubject.next(breakpoints);
  }

  renderTerminalData(data: any) {
    this.renderTerminalDataSubject.next(data);
  }

  inputData(data: any) {
    this.inputDataSubject.next(data);
  }

  runOrDebug(data: any) {
    this.runOrDebugSubject.next(data);
  }

  debuggingOptions(data: any) {
    this.debuggingOptionsSubject.next(data);
  }

  stopExecution() {

    this.stopExecutionSubject.next();
  }

  changeButtonsStatus(status: Boolean) {
    this.changeButtonsStatusSubject.next(status);
  }
  passVariables(data: Map<string, string>) {
    this.passVariablesSubject.next(data);
  }

  passCallstack(data: any) {
    this.passCallstackSubject.next(data);
  }

  debugStatus(status: Boolean) {
    this.debugStatusSubject.next(status);
  }

  clearDebugOutput() {
    this.clearDebugOutputSubject.next();
  }
}
