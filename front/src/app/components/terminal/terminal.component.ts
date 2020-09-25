import { Component, OnInit, OnDestroy } from '@angular/core';
import { TerminalService } from 'src/app/services/terminal-service';
import { Subscription } from 'rxjs/Subscription';
import { ExecutionService } from 'src/app/services/execution.service';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css'],
  providers: [TerminalService]
})
export class TerminalComponent implements OnInit, OnDestroy {

  constructor(private terminalService: TerminalService, private executionService: ExecutionService) {
    this.terminalService.commandHandler.subscribe(command => {

      if (command.includes('　')) {
        const c = command.replace('　', '');
        switch (c) {
          case 'run':
            this.mode = 'run';
            break;
          case 'debug':
            this.mode = 'debug';
            break;
          case 'stop':
            break;
          default:
            break;
        }
      } else {
        this.executionService.sendInput({ command: command, mode: this.mode });
      }
    });
  }

  private subscription: Subscription;
  prompt = '';
  mode: string;

  static writeTerminalCommand(command: any) {
    const terminalInput = <HTMLInputElement>document.querySelector('.ui-terminal-input');
    const keyboardEvent = new KeyboardEvent('keydown', { code: 'enter' });
    terminalInput.value = command.toString();
    terminalInput.dispatchEvent(new Event('input'));
    terminalInput.dispatchEvent(keyboardEvent);
    terminalInput.value = '';
    setTimeout(() => {
      document.querySelector('.ui-terminal').scrollTop = document.querySelector('.ui-terminal').scrollHeight;
    }, 10);
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
