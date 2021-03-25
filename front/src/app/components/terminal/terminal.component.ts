import { Component } from '@angular/core';
import { TerminalService } from 'src/app/services/terminal-service';
import { ExecutionService } from 'src/app/services/execution.service';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css'],
  providers: [TerminalService]
})
export class TerminalComponent {
  private messages: String[] = ['Welcome to pendë', 'Be as light as a pendë', 'Code as fast as a rocket'];
  private mode: string;
  
  message: String = '';
  
  constructor(private terminalService: TerminalService, private executionService: ExecutionService) {
    this.message = this.messages[Math.floor(Math.random() * this.messages.length)];
    this.terminalService.sendCommandObservable$.subscribe(command => {
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
        this.executionService.inputData({ command: command, mode: this.mode });
      }
    });
  }

  static writeTerminalCommand(command: any) {
    const terminalInput = <HTMLInputElement>document.querySelector('.ui-terminal-input');
    terminalInput.value = command.toString();
    terminalInput.dispatchEvent(new Event('input'));
    terminalInput.dispatchEvent(new KeyboardEvent('keydown', { code: 'enter' }));
    terminalInput.value = '';

    setTimeout(() => {
      document.querySelector('.ui-terminal').scrollTop = document.querySelector('.ui-terminal').scrollHeight;
    }, 10);
  }
}
