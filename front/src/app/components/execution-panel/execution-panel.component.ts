import { Component, OnInit, Input } from '@angular/core';
import { TerminalComponent } from 'src/app/components/terminal/terminal.component';
import { ExecutionService } from 'src/app/services/execution.service';
import { ISubscription } from 'rxjs/Subscription';
import { TabService } from 'src/app/services/tab-service';

@Component({
  selector: 'app-execution-panel',
  templateUrl: './execution-panel.component.html',
  styleUrls: ['./execution-panel.component.css'],
})
export class ExecutionPanelComponent implements OnInit {
  buttonsEnabled: Boolean = true;
  callstack: string[] = [];
  variables: Map<string, string> = new Map<string, string>();
  
  private initialized: Boolean = false;
  private newDataSubscription: ISubscription;
  
  isDebugging = false;
  
  @Input()
  themeColor: String = '';

  constructor(private executionService: ExecutionService, private tabService: TabService) {
    this.newDataSubscription = this.executionService.renderTerminalDataObservable$.subscribe(
      (data) => {
        this.renderTerminalData(data);
        this.toggleButtons(data);
      });

    const tabOpenedSub = this.tabService.renderTabSubjectObservable$.subscribe((tab) => {
      if (tab) {
        this.initialized = true;
        tabOpenedSub.unsubscribe();
      }
    });

    this.executionService.clearDebugOutputObservable$.subscribe(data => {
      this.clearDebugOutput();
    });

    this.executionService.changeButtonsStatusObservable$.subscribe(data => {
      this.buttonsEnabled = data;
    });

    this.executionService.passVariablesObservable$.subscribe((variables: Map<string, string>) => {
      this.variables = variables;
    });

    this.executionService.passCallstackObservable$.subscribe(callstack => {
      this.callstack = callstack;
    });
  }

  ngOnInit() {
    this.executionService.showBreakpoints();
  }

  checkInitialized() {
    if (!this.initialized) {
      window.alert('You should open a file first');
      return false;
    }

    return true;
  }

  runCode() {
    if (!this.checkInitialized()) {
      return;
    }

    this.clearDebugOutput();
    this.executionService.stopExecution();
    this.executionService.checkFileStatus();

    TerminalComponent.writeTerminalCommand('--run　');

    this.isDebugging = false;

    this.clearDebugOutput();
    this.executionService.debugStatus(this.isDebugging);
    this.executionService.runOrDebug(false);
  }

  debugCode() {
    if (!this.checkInitialized()) {
      return;
    }

    this.clearDebugOutput();
    this.executionService.stopExecution();
    this.executionService.checkFileStatus();

    TerminalComponent.writeTerminalCommand('--debug　');

    this.isDebugging = true;

    this.clearDebugOutput();
    this.executionService.debugStatus(this.isDebugging);
    this.executionService.runOrDebug(true);
  }

  stopExec() {
    TerminalComponent.writeTerminalCommand('stop　');

    this.buttonsEnabled = true;
    this.clearDebugOutput();

    this.executionService.stopExecution();
  }

  continueDebug() {
    if (!this.checkInitialized()) {
      return;
    }

    this.clearDebugOutput();
    this.executionService.debuggingOptions('c');
  }

  renderTerminalData(data: any) {
    TerminalComponent.writeTerminalCommand(data);
  }

  toggleButtons(data: any) {
    if (data === 'finished　') {
      this.buttonsEnabled = true;
    }
  }

  clearDebugOutput() {
    this.variables.clear();
    this.callstack = [];
  }
}
