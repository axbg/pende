import { Component, ViewChild, OnInit } from '@angular/core';
import { TabEditingServiceService } from '../tab-editing-service.service';
import { NavigationTab } from '../../classes/NavigationTab';
import { SettingsEditingServiceService } from '../settings-editing-service.service';
import { ExecutionService } from '../execution.service';
import { LayoutService } from '../layout.service';
import { FilesEditingService } from '../files-editing.service';
import * as FileSave from 'file-saver';

@Component({
  selector: 'app-ace-editor',
  templateUrl: './ace-editor.component.html',
  styleUrls: ['./ace-editor.component.css'],
})
export class AceEditorComponent implements OnInit {
  @ViewChild('editor') editor;
  currentTab: NavigationTab;
  showBreakpoints: boolean = false;

  constructor(private tabEditingService: TabEditingServiceService,
    private settingsEditingService: SettingsEditingServiceService,
    private executionService: ExecutionService,
    private layoutService: LayoutService,
    private fileEditingService: FilesEditingService) {

    this.tabEditingService.tabOpened$.subscribe(
      tab => {

        if (this.currentTab) {
          this.currentTab.setContent(this.editor.getEditor().getValue());
          this.currentTab.setCursor(this.editor.getEditor().selection.getCursor().row, this.editor.getEditor().selection.getCursor().column);
          this.tabEditingService.saveTabSource(this.currentTab);
        }

        this.currentTab = tab;
        this.editor.getEditor().setValue(this.currentTab.getContentForDisplay());
        this.editor.getEditor().selection.moveTo(this.currentTab.getCursorLine(), this.currentTab.getCursorColumn());
        this.editor.getEditor().focus();

        setTimeout(() => {
          this.drawBreakpoints(true);
          this.showBreakpoints = false;
        }, 800);

        this.executionService.sendExecutionBreakpoints(this.currentTab.getBreakpoints());

        let language = this.currentTab.getTitle().split(".")[1];
        switch (language) {
          case 'c':
            this.editor.setMode("c_cpp");
            break;
          case 'cpp':
            this.editor.setMode("c_cpp");
            break;
          default:
            console.log("not supported yet");
        }
      }
    )

    this.settingsEditingService.modifiedSettings$.subscribe(
      setting => {
        switch (setting.getProperty()) {
          case "theme":
            this.editor.setTheme(setting.getValue());
            this.layoutService.changeThemeColor(setting.getValue());
            break;
          case "cursor":
            this.editor.getEditor().setOptions({
              keyboardHandler: setting.getValue()
            })
            break;
          case "fontSize":
            this.editor.getEditor().setOptions({
              fontSize: setting.getValue() + "px"
            })
            break;
          case "gutter":
            this.editor.getEditor().setOptions({
              showGutter: setting.getValue()
            })
            break;
          default:
        }
      })

    this.executionService.beforeExecutionFileStatusCheck$.subscribe(data => {
      /*
      if (this.currentTab.getModified()) {
        this.executionService.sendModifiedFile(this.currentTab);
      } else {
        this.executionService.sendUnmodifiedFile(this.currentTab);
      }
      */
      (<HTMLElement>document.querySelector(".ui-tabview-selected")).style.backgroundColor = "#007AD9";
      this.executionService.sendModifiedFile(this.currentTab);
    })

    this.executionService.detectExecutionBreakpoints$.subscribe((data) => {
      this.drawBreakpoints(true);
      this.executionService.sendExecutionBreakpoints(this.currentTab.getBreakpoints());
    })
  }

  ngOnInit() {
    this.generateBreakPoints();
  }

  generateBreakPoints() {
    const gutt = document.querySelector(".ace_layer");
    const ref = this;

    function addOrRemoveBreakpoint(e) {
      let line = e.target.innerText;

      if (e.target.classList.contains("breakpoint")) {
        e.target.classList.remove("breakpoint");
        ref.currentTab.removeBreakpoint(line);
        ref.executionService.sendExecutionBreakpoints(ref.currentTab.getBreakpoints());
      } else {
        e.target.classList.add("breakpoint");
        if (ref.currentTab.getBreakpoints().indexOf(parseInt(line)) === -1) {
          ref.currentTab.addBreakpoint(parseInt(line));
          ref.executionService.sendExecutionBreakpoints(ref.currentTab.getBreakpoints());
        }

        if (!ref.showBreakpoints) {
          ref.drawBreakpoints(true);
        }
      }
    }

    gutt.addEventListener("DOMNodeInserted", (e) => {
      e.target.removeEventListener("click", addOrRemoveBreakpoint);
      e.target.addEventListener("click", addOrRemoveBreakpoint);
    });
  }

  ngAfterViewInit() {
    this.editor.setTheme("dracula");
    this.editor.setMode("c_cpp");

    this.editor.getEditor().setOptions({
      enableLiveAutocompletion: true,
      copyWithEmptySelection: true
    });

    this.editor.getEditor().commands.addCommand({
      name: "save",
      bindKey: "Ctrl-s",
      exec: (editor) => {
        this.saveFile();
      }
    })

    this.editor.getEditor().commands.addCommand({
      name: "download",
      bindKey: "Ctrl-d",
      exec: (editor) => {
        this.downloadFile();
      }
    })

    this.editor.getEditor().commands.addCommand({
      name: "clearBreakpoints",
      bindKey: "Ctrl-g",
      exec: (editor) => {
        this.drawBreakpoints(false);
        this.showBreakpoints = true;
        this.currentTab.setBreakpoints([]);
      }
    })

    this.editor.getEditor().commands.addCommand({
      name: "showBreakpoints",
      bindKey: "Ctrl-b",
      exec: (editor) => {
        this.showBreakpoints = !this.showBreakpoints;
        if (this.showBreakpoints) {
          this.drawBreakpoints(true);
        } else {
          this.drawBreakpoints(false);
        }
      }
    })

    let typingInterval = 800;
    let typingTimer;

    let doneTyping = () => {
      this.drawBreakpoints(true);
    }

    this.editor.getEditor().session.on('change', (delta) => {
      if (!(delta.start.row === 0 && delta.end.row === delta.lines.length - 1)) {


        if (delta.end.row - delta.start.row !== 0) {
          let newBreakpoints = this.currentTab.getBreakpoints();
          for (let index = 0; index < this.currentTab.getBreakpoints().length; index++) {
            if (newBreakpoints[index] >= delta.end.row) {
              if (delta.action === "insert") {
                newBreakpoints[index] += (delta.end.row - delta.start.row);
              } else {
                newBreakpoints[index] += (delta.start.row - delta.end.row);
              }
            }
          }
        }

        if (!this.currentTab.getModified()) {
          (<HTMLElement>document.querySelector(".ui-tabview-selected")).style.backgroundColor = "#B71C1C";
          this.currentTab.setModified(true);
        }

        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, typingInterval);
      }
    });
  }

  drawBreakpoints(show: boolean) {
    const gutters = document.querySelectorAll(".ace_gutter-cell");

    for (let i: number = 0; i < gutters.length; i++) {
      if (this.currentTab.getBreakpoints().includes(parseInt(gutters[i].textContent))) {
        if (show) {
          gutters[i].classList.add("breakpoint");
        } else {
          gutters[i].classList.remove("breakpoint");
        }
      }
    }
  }

  saveFile() {
    (<HTMLElement>document.querySelector(".ui-tabview-selected")).removeAttribute("style");
    this.currentTab.setContent(this.editor.getEditor().getValue());
    this.tabEditingService.saveTabSource(this.currentTab);
    this.currentTab.setModified(false);

    setTimeout(() => {
      this.fileEditingService.saveFile(this.currentTab);
    }, 50);
  }

  downloadFile() {
    let blob = new Blob([<BlobPart>this.currentTab.getContent()], { type: "plain/text;charset=utf-8" });
    FileSave.saveAs(blob, <string>this.currentTab.getTitle());
  }
}