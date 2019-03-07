import { Component, ViewChild, OnInit } from '@angular/core';
import { TabEditingServiceService } from '../tab-editing-service.service';
import { NavigationTab } from '../../classes/NavigationTab';
import { SettingsEditingServiceService } from '../settings-editing-service.service';
import { ExecutionService } from '../execution.service';

@Component({
  selector: 'app-ace-editor',
  templateUrl: './ace-editor.component.html',
  styleUrls: ['./ace-editor.component.css'],
})
export class AceEditorComponent implements OnInit {
  @ViewChild('editor') editor;
  currentTab: NavigationTab;
  breakPoints: number[] = [];

  constructor(private tabEditingService: TabEditingServiceService,
    private settingsEditingService: SettingsEditingServiceService,
    private executionService: ExecutionService) {

    this.tabEditingService.tabOpened$.subscribe(
      tab => {

        if (this.currentTab) {
          this.currentTab.setContent(this.editor.getEditor().getValue());
          this.currentTab.setCursor(this.editor.getEditor().selection.getCursor().row, this.editor.getEditor().selection.getCursor().column);
          this.tabEditingService.saveTabSource(this.currentTab);
        }

        this.currentTab = tab;
        this.editor.getEditor().setValue(this.currentTab.getContent());
        this.editor.getEditor().selection.moveTo(this.currentTab.getCursorLine(), this.currentTab.getCursorColumn());
        this.editor.getEditor().focus();

        let language = this.currentTab.getTitle().split(".")[1];
        switch (language) {
          case 'c':
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
      if (this.currentTab.getModified()) {
        //api call to save file
        //will be done with async await so the service down below will be executed after
      }
      this.executionService.sendCurrentFileId(this.currentTab.getId(), this.currentTab.getTitle());
    })
  }

  ngOnInit() {
    this.generateBreakPoints();
  }

  //bug: on new line, breakpoints are removed
  //find a way to handle them
  //probably in the execution panel
  //send them one by one through a service and display them there
  addOrRemoveBreakpoint(e) {
    let line = e.target.innerText;
    console.log(line);
    if (e.target.classList.contains("breakpoint")) {
      //service to remove breakpoint
      e.target.classList.remove("breakpoint");
    } else {
      //service to add breakpoint
      e.target.classList.add("breakpoint");
    }
  }

  generateBreakPoints() {
    const gutt = document.querySelector(".ace_layer");
    gutt.addEventListener("DOMNodeInserted", (e) => {
      e.target.removeEventListener("click", this.addOrRemoveBreakpoint);
      e.target.addEventListener("click", this.addOrRemoveBreakpoint);
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
      name: "showOtherCompletions",
      bindKey: "Ctrl-s",
      exec: (editor) => {
        this.saveFile();
        console.log("this will call api and will set modified to false in the callback");
      }
    })

    //if one or multiple letters are introduced a tab will be marked as modified
    //the modified property is set to false after it's saved in the back-end
    this.editor.getEditor().session.on('change', (delta) => {
      if (delta.lines[0].length === 1) {
        this.currentTab.setModified(true);
      }
    });
  }

  saveFile() {
    //rest call to save file
    //in the callback set modified to false
    console.log('ya');
    //this.currentTab.setModified(false);
  }
}