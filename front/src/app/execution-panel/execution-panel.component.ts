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

  private getExecutedFileIdSubscription: ISubscription;
  private getExecutionBreakpointtsSubscription: ISubscription;

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
  }

  ngOnInit() {
    this.executionService.showExecutionBreakpoints();
  }

  runCode() {
    this.isDebugging = false;
    this.executionService.checkCurrentFileStatus();
    TerminalComponent.writeTerminalCommand("run " + this.fileName, this.fileId);
  }

  debugCode() {
    this.isDebugging = true;
    this.executionService.checkCurrentFileStatus();
    TerminalComponent.writeTerminalCommand("debug " + this.fileName, this.fileId);
  }

  stopExec() {
    TerminalComponent.writeTerminalCommand("stop", 0);
  }

  ngOnDestroy() {
    this.getExecutionBreakpointtsSubscription.unsubscribe();
  }

}
