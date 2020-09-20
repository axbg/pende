import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { TerminalComponent } from "../terminal/terminal.component";
import { ExecutionService } from "../execution.service";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: "app-execution-panel",
  templateUrl: "./execution-panel.component.html",
  styleUrls: ["./execution-panel.component.css"],
})
export class ExecutionPanelComponent implements OnInit, OnDestroy {
  private isDebugging = false;

  @Input()
  private variables: Map<string, string> = new Map<string, string>();

  @Input()
  private callstack: string[] = [];

  private fileId = 0;
  private fileName = "";

  @Input()
  private themeColor: String;

  private newDataSubscription: ISubscription;

  constructor(private executionService: ExecutionService) {
    this.newDataSubscription = this.executionService.newDataReceived$.subscribe(
      (data) => {
        this.renderOutput(data);
      }
    );
  }

  ngOnInit() {
    this.executionService.showExecutionBreakpoints();
  }

  runCode() {
    this.executionService.stopExecution();
    this.executionService.checkCurrentFileStatus();
    TerminalComponent.writeTerminalCommand("run　");
    this.isDebugging = false;
    this.executionService.changeRunOrDebug(false);
  }

  debugCode() {
    this.executionService.stopExecution();
    this.executionService.checkCurrentFileStatus();
    TerminalComponent.writeTerminalCommand("debug　");
    this.isDebugging = true;
    this.executionService.changeRunOrDebug(true);
  }

  stopExec() {
    const em = <HTMLElement>document.getElementById("run");
    const em2 = <HTMLElement>document.getElementById("debug");
    em.removeAttribute("disabled");
    em.removeAttribute("style");
    em2.removeAttribute("disabled");
    em2.removeAttribute("style");
    TerminalComponent.writeTerminalCommand("stop　");
    this.executionService.stopExecution();
  }

  continueDebug() {
    this.executionService.debugOptions("c");
  }

  stepOverDebug() {
    this.executionService.debugOptions("next");
  }

  stepIntoDebug() {
    this.executionService.debugOptions("step");
  }

  stepOutDebug() {
    this.executionService.debugOptions("finish");
  }

  renderOutput(data) {
    TerminalComponent.writeTerminalCommand(data);
  }

  ngOnDestroy() {
    this.newDataSubscription.unsubscribe();
  }
}
