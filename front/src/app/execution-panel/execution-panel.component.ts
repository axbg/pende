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
  private variables: Map<string, string> = new Map<string, string>();
  private callstack: String[] = [];
  private fileId: number = 0;
  private fileName: string = "";
  private breakpoints: number[];

  @Input()
  private hasWhiteTheme: boolean;

  private getExecutionBreakpointtsSubscription: ISubscription;
  private newDataSubscription: ISubscription;

  constructor(private executionService: ExecutionService, private layoutService: LayoutService) {
    this.variables.set("a", "5");
    this.variables.set("b", "bco");
    this.variables.set("c", "proba proba");
    this.callstack.push("line 2");
    this.callstack.push("line 3");

    this.getExecutionBreakpointtsSubscription =
      this.executionService.getExecutionBreakpoints$.subscribe(breakpoints => {
        this.breakpoints = breakpoints;
        console.log(breakpoints);
      })

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
  }

  renderOutput(data) {
    TerminalComponent.writeTerminalCommand(data);
  }

  ngOnDestroy() {
    this.getExecutionBreakpointtsSubscription.unsubscribe();
    this.newDataSubscription.unsubscribe();
  }

}
