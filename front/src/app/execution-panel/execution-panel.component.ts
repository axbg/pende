import { Component, OnInit, OnDestroy } from '@angular/core';
import { TerminalComponent } from '../terminal/terminal.component';
import { ExecutionService } from '../execution.service';
import { ISubscription } from 'rxjs/Subscription';

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

  private getExecutedFileIdSubscription: ISubscription;
  private getExecutionBreakpointtsSubscription: ISubscription;

  constructor(private executionService: ExecutionService) {
    this.variables.set("a", "5");
    this.variables.set("b", "bco");
    this.variables.set("c", "proba proba");
    this.callstack.push("line 2");
    this.callstack.push("line 3");

    this.getExecutedFileIdSubscription = this.executionService.getExecutedFileId$.subscribe(data => {
      this.fileId = data[0];
      this.fileName = data[1];
    })

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
    this.getExecutedFileIdSubscription.unsubscribe();
    this.getExecutionBreakpointtsSubscription.unsubscribe();
  }

}
