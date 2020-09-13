import { Component } from '@angular/core';
import { NgModule, AfterViewInit, AfterViewChecked, OnDestroy, Input, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TerminalService } from './terminalservice';
import { Subscription } from 'rxjs';

// this is a remake of the primeng terminal component
// because the one present in the library is outdated..
@Component({
    selector: 'app-prime-terminal',
    templateUrl: './prime-terminal.component.html',
    styleUrls: ['./prime-terminal.component.css'],
})
export class PrimeTerminalComponent implements AfterViewInit, AfterViewChecked, OnDestroy {

    @Input() welcomeMessage: string;

    @Input() prompt: string;

    @Input() style: any;

    @Input() styleClass: string;

    commands: any[] = [];

    command: string;

    container: Element;

    commandProcessed: boolean;

    subscription: Subscription;

    constructor(public el: ElementRef, public terminalService: TerminalService) {
        this.subscription = terminalService.responseHandler.subscribe(response => {
            this.commands[this.commands.length - 1].response = response;
            this.commandProcessed = true;
        });
    }

    ngAfterViewInit() {
        this.container = <Element>document.querySelector('.ui-terminal');
    }

    ngAfterViewChecked() {
        if (this.commandProcessed) {
            this.container.scrollTop = this.container.scrollHeight;
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

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}
@NgModule({
    imports: [CommonModule, FormsModule],
    exports: [PrimeTerminalComponent],
    declarations: [PrimeTerminalComponent]
})
export class TerminalModule { }
