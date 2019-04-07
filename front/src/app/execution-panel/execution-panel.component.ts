import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { TerminalComponent } from '../terminal/terminal.component';
import { ExecutionService } from '../execution.service';
import { ISubscription } from 'rxjs/Subscription';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-execution-panel',
  templateUrl: './execution-panel.component.html',
  styleUrls: ['./execution-panel.component.css']
})
export class ExecutionPanelComponent implements OnInit, OnDestroy {

  private isDebugging: boolean = false;

  @Input()
  private variables: Map<string, string> = new Map<string, string>();

  @Input()
  private callstack: string[] = [];
  
  private fileId: number = 0;
  private fileName: string = "";

  @Input()
  private hasWhiteTheme: boolean;

  private newDataSubscription: ISubscription;

  constructor(private executionService: ExecutionService, private layoutService: LayoutService) {
    this.newDataSubscription = this.executionService.newDataReceived$.subscribe(data => {
      this.renderOutput(data);
    })
  }

  ngOnInit() {
    this.executionService.showExecutionBreakpoints();
  }

  runCode() {
    if (!this.isDebugging) {
      this.executionService.checkCurrentFileStatus();
      TerminalComponent.writeTerminalCommand("run　");
    }
    this.isDebugging = false;
    this.executionService.changeRunOrDebug(false);
  }

  debugCode() {
    if (this.isDebugging) {
      this.executionService.checkCurrentFileStatus();
      TerminalComponent.writeTerminalCommand("debug　");
    }
    this.isDebugging = true;
    this.executionService.changeRunOrDebug(true);
  }

  stopExec() {
    TerminalComponent.writeTerminalCommand("stop　");
    this.executionService.stopExecution();
  }

  continueDebug(){
    this.executionService.debugOptions("c");
  }

  stepOverDebug(){
    this.executionService.debugOptions("next");
  }

  stepIntoDebug(){
    this.executionService.debugOptions("step");
  }

  stepOutDebug(){
    this.executionService.debugOptions("finish");
  }

  renderOutput(data) {
    TerminalComponent.writeTerminalCommand(data);
  }

  ngOnDestroy() {
    this.newDataSubscription.unsubscribe();
  }

}
