import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { TabService } from 'src/app/services/tab-service';
import { NavigationTab } from 'src/app/classes/NavigationTab';
import { ExecutionService } from 'src/app/services/execution.service';
import { LayoutService } from 'src/app/services/layout.service';
import { FileService } from 'src/app/services/file-service';
import * as FileSave from 'file-saver';
import * as Formatter from 'js-beautify';
import { Constants } from 'src/app/classes/Constants';
@Component({
  selector: 'app-ace-editor',
  templateUrl: './ace-editor.component.html',
  styleUrls: ['./ace-editor.component.css'],
})
export class AceEditorComponent implements OnInit, AfterViewInit {
  @ViewChild('editor') editor: any;

  currentTab?: NavigationTab;
  showEditor = false;
  showBreakpoints = false;
  darkTheme = false;

  constructor(
    private tabService: TabService,
    private executionService: ExecutionService,
    private layoutService: LayoutService,
    private fileService: FileService
  ) {
    this.tabService.renderTabSubjectObservable$.subscribe((tab) => {
      if (tab && tab.getId()) {
        if (this.showEditor === false) {
          this.showEditor = true;
        }

        if (this.currentTab) {
          this.currentTab.setContent(this.editor.getEditor().getValue());
          this.currentTab.setCursor(
            this.editor.getEditor().selection.getCursor().row,
            this.editor.getEditor().selection.getCursor().column
          );
        }

        this.currentTab = tab;
        this.editor
          .getEditor()
          .setValue(this.currentTab.getContentForDisplay());
        this.editor
          .getEditor()
          .selection.moveTo(
            this.currentTab.getCursorLine(),
            this.currentTab.getCursorColumn()
          );
        this.editor.getEditor().focus();

        setTimeout(() => {
          this.drawBreakpoints(true);
          this.showBreakpoints = false;
        }, 800);

        this.executionService.executionBreakpoints(
          this.currentTab.getBreakpoints()
        );

        const language = this.currentTab.getTitle().split('.')[1];
        switch (language) {
          case 'c':
            this.editor.setMode('c_cpp');
            break;
          case 'cpp':
            this.editor.setMode('c_cpp');
            break;
          default:
            console.log('not supported yet');
        }
      }
    });

    this.tabService.notifyLastTabClosedObservable$.subscribe(() => {
      this.showEditor = false;
    });

    this.layoutService.changeSettingObservable$.subscribe((setting) => {
      switch (setting.getProperty()) {
        case 'theme':
          this.editor.setTheme(setting.getValue());
          this.darkTheme = Constants.BLACK_THEMES.includes(setting.getValue());
          break;
        case 'cursor':
          this.editor.getEditor().setOptions({
            keyboardHandler: setting.getValue(),
          });
          break;
        case 'fontSize':
          this.editor.getEditor().setOptions({
            fontSize: setting.getValue() + 'px',
          });
          break;
        case 'gutter':
          this.editor.getEditor().setOptions({
            showGutter: setting.getValue(),
          });
          break;
        default:
      }
    });

    this.executionService.checkFileStatusObservable$.subscribe((data) => {
      this.tabService.notifyFileContentChanged(false);
      this.executionService.modifyFile(this.currentTab!);
    });

    this.executionService.showBreakpointsObservable$.subscribe(() => {
      if (this.showEditor) {
        this.drawBreakpoints(true);
        this.executionService.executionBreakpoints(
          this.currentTab!.getBreakpoints()
        );
      }
    });

    this.fileService.saveFileShortcutObservable$.subscribe(() => {
      this.saveFile();
    });
  }

  ngOnInit() {
    this.generateBreakPoints();
  }

  generateBreakPoints() {
    const gutt = document.querySelector('.ace_layer');
    const ref = this;

    function addOrRemoveBreakpoint(e: any) {
      const line = e.target.innerText;

      if (e.target.classList.contains('breakpoint')) {
        e.target.classList.remove('breakpoint');
        ref.currentTab!.removeBreakpoint(line);
        ref.executionService.executionBreakpoints(
          ref.currentTab!.getBreakpoints()
        );
      } else {
        e.target.classList.add('breakpoint');
        if (ref.currentTab!.getBreakpoints().indexOf(parseInt(line)) === -1) {
          ref.currentTab!.addBreakpoint(parseInt(line));
          ref.executionService.executionBreakpoints(
            ref.currentTab!.getBreakpoints()
          );
        }

        if (!ref.showBreakpoints) {
          ref.drawBreakpoints(true);
        }
      }
    }

    gutt!.addEventListener('DOMNodeInserted', (e) => {
      e.target!.removeEventListener('click', addOrRemoveBreakpoint);
      e.target!.addEventListener('click', addOrRemoveBreakpoint);
    });
  }

  ngAfterViewInit() {
    this.editor.getEditor().setOptions({
      enableLiveAutocompletion: true,
      copyWithEmptySelection: true,
    });

    this.editor.getEditor().commands.addCommand({
      name: 'save',
      bindKey: 'Ctrl-s',
      exec: () => {
        this.saveFile();
      }
    });

    this.editor.getEditor().commands.addCommand({
      name: 'download',
      bindKey: 'Ctrl-d',
      exec: () => {
        this.downloadFile();
      }
    });

    this.editor.getEditor().commands.addCommand({
      name: 'clearBreakpoints',
      bindKey: 'Ctrl-g',
      exec: () => {
        this.drawBreakpoints(false);
        this.showBreakpoints = true;
        this.currentTab!.setBreakpoints([]);
      }
    });

    this.editor.getEditor().commands.addCommand({
      name: 'showBreakpoints',
      bindKey: 'Ctrl-b',
      exec: () => {
        this.showBreakpoints = !this.showBreakpoints;
        if (this.showBreakpoints) {
          this.drawBreakpoints(true);
        } else {
          this.drawBreakpoints(false);
        }
      }
    });

    this.editor.getEditor().commands.addCommand({
      name: 'formatCode',
      bindKey: 'Ctrl-l',
      exec: () => {
        this.editor
          .getEditor()
          .setValue(
            // Formatter.js_beautify(this.editor.getEditor().getValue()).join('\n')
            Formatter.js_beautify(this.editor.getEditor().getValue())
          );
      },
    });

    const typingInterval = 800;
    let typingTimer: any;

    const doneTyping = () => {
      this.drawBreakpoints(true);
    };

    this.editor.getEditor().session.on('change', (delta: any) => {
      if (
        !(delta.start.row === 0 && delta.end.row === delta.lines.length - 1)
      ) {
        if (delta.end.row - delta.start.row !== 0) {
          const newBreakpoints = this.currentTab!.getBreakpoints();
          for (
            let index = 0;
            index < this.currentTab!.getBreakpoints().length;
            index++
          ) {
            if (newBreakpoints[index] >= delta.end.row) {
              if (delta.action === 'insert') {
                newBreakpoints[index] += delta.end.row - delta.start.row;
              } else {
                newBreakpoints[index] += delta.start.row - delta.end.row;
              }
            }
          }
        }

        if (!this.currentTab!.getModified()) {
          this.tabService.notifyFileContentChanged(true);
          this.currentTab!.setModified(true);
        }

        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, typingInterval);
      }
    });
  }

  drawBreakpoints(show: boolean) {
    if (this.showEditor) {
      const gutters = document.querySelectorAll('.ace_gutter-cell');

      for (let i = 0; i < gutters.length; i++) {
        if (
          this.currentTab!
            .getBreakpoints()
            .includes(parseInt(gutters[i].textContent!))
        ) {
          if (show) {
            gutters[i].classList.add('breakpoint');
          } else {
            gutters[i].classList.remove('breakpoint');
          }
        }
      }
    }
  }

  saveFile() {
    this.tabService.notifyFileContentChanged(false);
    this.currentTab!.setContent(this.editor.getEditor().getValue());
    this.currentTab!.setModified(false);

    setTimeout(() => {
      this.fileService.saveFile(this.currentTab);
    }, 50);
  }

  downloadFile() {
    const blob = new Blob([<BlobPart>this.currentTab!.getContent()], {
      type: 'plain/text;charset=utf-8',
    });

    FileSave.saveAs(blob, <string>this.currentTab!.getTitle());
  }
}
