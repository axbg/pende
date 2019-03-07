import { Component, OnInit } from '@angular/core';
import { TerminalComponent } from '../terminal/terminal.component';
import { NavigationTab } from 'src/classes/NavigationTab';
import { TabEditingServiceService } from '../tab-editing-service.service';
import { ExecutionService } from '../execution.service';

@Component({
  selector: 'app-execution-panel',
  templateUrl: './execution-panel.component.html',
  styleUrls: ['./execution-panel.component.css']
})
export class ExecutionPanelComponent implements OnInit {

  private isDebugging: boolean = true;
  private variables: Map<string, string> = new Map<string, string>();
  private callstack: String[] = [];
  private fileId: number = 0;
  private fileName: string = "";

  constructor(private executionService: ExecutionService) {
    this.variables.set("a", "5");
    this.variables.set("b", "bco");
    this.variables.set("c", "proba proba");
    this.callstack.push("line 2");
    this.callstack.push("line 3");

    this.executionService.getExecutedFileId$.subscribe(data => {
      this.fileId = data[0];
      this.fileName = data[1];
    })
  }

  ngOnInit() {
  }

  runCode() {
    this.executionService.checkCurrentFileStatus();
    TerminalComponent.writeTerminalCommand("run " + this.fileName, this.fileId);
  }

  debugCode() {
    //kinda same like runCode
  }

  stopExec() {
    //kinda same like run and debug
  }

}
