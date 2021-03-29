import { Component } from '@angular/core';
import { AfterViewInit, AfterViewChecked, Input, ElementRef } from '@angular/core';
import { TerminalService } from 'src/app/services/terminal-service';

@Component({
    selector: 'app-prime-terminal',
    templateUrl: './prime-terminal.component.html',
    styleUrls: ['./prime-terminal.component.css'],
})
export class PrimeTerminalComponent implements AfterViewInit, AfterViewChecked {
    commands: any[] = [];
    command = '';
    container?: Element;
    commandProcessed = false;

    @Input()
    welcomeMessage: String = '';

    @Input()
    prompt: String = '';

    @Input()
    style: any;

    @Input()
    styleClass = '';

    constructor(public el: ElementRef, public terminalService: TerminalService) {
        terminalService.sendResponseObservable$.subscribe(response => {
            this.commands[this.commands.length - 1].response = response;
            this.commandProcessed = true;
        });
    }

    ngAfterViewInit() {
        this.container = (document.querySelector('.ui-terminal') as Element);
    }

    ngAfterViewChecked() {
        if (this.commandProcessed) {
            this.container!.scrollTop = this.container!.scrollHeight;
            this.commandProcessed = false;
        }
    }

    @Input()
    set response(value: string) {
        if (value) {
            this.commands[this.commands.length - 1].response = value;
            this.commandProcessed = true;
        }
    }

    handleCommand(event: KeyboardEvent) {
        // tslint:disable-next-line: deprecation
        if (event.code === 'enter' || event.keyCode === 13) {
            if (this.command.includes('ᚠ')) {
                this.command.split('ᚠ').forEach(element => {
                    this.commands.push({ text: element });
                });
            } else if (this.command === 'stop　') {
                this.commands = [];
            } else {
                this.commands.push({ text: this.command });
            }
            this.terminalService.sendCommand(this.command);
            this.command = '';
        }
    }

    focus(element: HTMLElement) {
        element.focus();
    }
}
