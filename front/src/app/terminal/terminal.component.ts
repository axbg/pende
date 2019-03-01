import { Component, OnInit } from '@angular/core';
import { TerminalService } from '../prime-terminal/terminalservice'
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css'],
  providers: [TerminalService]
})
export class TerminalComponent implements OnInit {

  private subscription: Subscription;

  constructor(private terminalService: TerminalService) {
    this.terminalService.commandHandler.subscribe(command => {
      let response = (command === 'date') ? new Date().toDateString() : 'Unknown command: ' + command;

      //here commands and inputs will be read and sent to backend
      //the result will be retrieved
      //and it will be displayed 

      this.terminalService.sendResponse(response);
    });
  }

  ngOnInit() {

  }

  // will be called using a service from other components
  // so, when you click on a button, such as run, a command will be launched
  // and the command will be processed in the commandHandler defined above
  writeTerminalCommand(command: String) {
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
