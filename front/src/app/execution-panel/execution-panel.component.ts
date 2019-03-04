import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-execution-panel',
  templateUrl: './execution-panel.component.html',
  styleUrls: ['./execution-panel.component.css']
})
export class ExecutionPanelComponent implements OnInit {

  private isDebugging: boolean = true;
  private variables: Map<string, string> = new Map<string, string>();
  private callstack: String[] = [];

  constructor() {
    this.variables.set("a", "5");
    this.variables.set("b", "bco");
    this.variables.set("c", "proba proba");
    this.callstack.push("line 2");
    this.callstack.push("line 3");
  }

  ngOnInit() {
  }

}
