import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { TerminalComponent } from 'src/app/components/terminal/terminal.component';
import { ExecutionService } from 'src/app/services/execution.service';
import { ISubscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-execution-panel',
  templateUrl: './execution-panel.component.html',
  styleUrls: ['./execution-panel.component.css'],
})
export class ExecutionPanelComponent implements OnInit, OnDestroy {
  private isDebugging = false;

  @Input()
  private variables: Map<string, string> = new Map<string, string>();

  @Input()
  private callstack: string[] = [];

  @Input()
  private initialized: boolean;

  @Input()
  private themeColor: String;

  private buttonsEnabled: Boolean = true;
  private newDataSubscription: ISubscription;

  constructor(private executionService: ExecutionService) {
    this.newDataSubscription = this.executionService.newDataReceived$.subscribe(
      (data) => {
        this.renderOutput(data);
        this.toggleButtons(data);
      }
    );
  }

  ngOnInit() {
    this.executionService.showExecutionBreakpoints();
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

    this.executionService.stopExecution();
    this.executionService.checkCurrentFileStatus();

    TerminalComponent.writeTerminalCommand('run　');

    this.isDebugging = false;
    this.executionService.changeRunOrDebug(false);
  }

  debugCode() {
    if (!this.checkInitialized()) {
      return;
    }

    this.executionService.stopExecution();
    this.executionService.checkCurrentFileStatus();
    TerminalComponent.writeTerminalCommand('debug　');
    this.isDebugging = true;
    this.executionService.changeRunOrDebug(true);
  }

  stopExec() {
    this.buttonsEnabled = true;
    TerminalComponent.writeTerminalCommand('stop　');
    this.executionService.stopExecution();
  }

  continueDebug() {
    if (!this.checkInitialized()) {
      return;
    }

    this.executionService.debugOptions('c');
  }

  renderOutput(data) {
    TerminalComponent.writeTerminalCommand(data);
  }

  toggleButtons(data) {
    if(data === 'finished　') {
      this.buttonsEnabled = true;
    }
  }

  ngOnDestroy() {
    this.newDataSubscription.unsubscribe();
  }
}
