import { Component, OnInit } from '@angular/core';
import { TerminalService } from '../prime-terminal/terminalservice'
import { Subscription } from 'rxjs/Subscription';
import { ExecutionService } from '../execution.service';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css'],
  providers: [TerminalService]
})
export class TerminalComponent implements OnInit {

  private subscription: Subscription;
  prompt: string = "";

  constructor(private terminalService: TerminalService, private executionService: ExecutionService) {
    this.terminalService.commandHandler.subscribe(command => {

      if (command.includes("　")) {
        let c = command.replace("　", "");
        switch (c) {
          case "run":
            break;
          case "debug":
            break;
          case "stop":
            break;
        }
      } else {
        this.executionService.sendInput(command);
      }
    });
  }

  ngOnInit() {

  }

  // will be called using a service from other components
  // so, when you click on a button, such as run, a command will be launched
  // and the command will be processed in the commandHandler defined above
  static writeTerminalCommand(command: any) {
    let terminalInput = <HTMLInputElement>document.querySelector(".ui-terminal-input");
    let keyboardEvent = new KeyboardEvent("keydown", { code: "enter" });
    terminalInput.value = command.toString();
    terminalInput.dispatchEvent(new Event("input"));
    terminalInput.dispatchEvent(keyboardEvent);
    terminalInput.value = "";
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
